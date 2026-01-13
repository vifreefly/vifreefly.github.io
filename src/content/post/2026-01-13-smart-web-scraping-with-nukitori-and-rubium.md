---
title: "Smart AI Web Scraping with Nukitori and Rubium/Kimurai"
description: "Learn how to extract structured data from web pages using AI-powered Nukitori gem combined with Rubium headless browser or Kimurai framework"
publishDate: "13 Jan 2026"
tags: ["ruby", "web-scraping", "ai", "llm"]
---

Web scraping often means writing brittle XPath or CSS selectors that break whenever a website updates its layout. What if you could just describe the data you want, and let AI figure out how to extract it?

That's exactly what [Nukitori](https://github.com/vifreefly/nukitori) does. Combined with [Rubium](https://github.com/vifreefly/rubium) for browser automation, you get a powerful scraping setup that's both flexible and maintainable.

## How Nukitori Works

Nukitori uses an LLM to analyze HTML and generate XPath extraction rules. The clever part: it only calls the AI once per page type, then saves the generated schema for reuse. Subsequent extractions are pure XPath - fast and free.

## Setup

Add the gems to your Gemfile:

```ruby
gem 'nukitori'
gem 'rubium'
```

Configure Nukitori with your LLM provider:

```ruby
require 'nukitori'
require 'rubium'

Nukitori.configure do |config|
  config.default_model = 'gemini-3-flash-preview'
  config.gemini_api_key = '<GEMINI_API_KEY>'
end
```

Nukitori supports multiple providers: OpenAI, Anthropic, Gemini, DeepSeek, and any OpenAI-compatible API.

## Scraping GitHub Search Results

Here's a complete example that scrapes GitHub repository search results with automatic pagination - without writing a single CSS selector or XPath manually:

```ruby
browser = Rubium::Browser.new
next_page_url = 'https://github.com/search?q=kimurai&type=repositories'
repos = []

while next_page_url
  browser.visit(next_page_url) ; sleep 2

  data = Nukitori(browser.current_response, 'repos_schema.json') do
    string :next_page_url, description: 'Next page path url'
    array :repos do
      object do
        string :name
        string :description, description: 'Repository short description'
        string :url
        string :stars
        string :language
        array :tags, of: :string
      end
    end
  end

  repos.concat(data['repos'])
  next_page_url = data['next_page_url']
end

File.write('repos.json', JSON.pretty_generate(repos))
```

## Understanding the Schema DSL

The block passed to `Nukitori()` defines the data structure you want to extract:

- `string :field_name` - extracts a text value
- `array :items do ... end` - extracts a list of objects
- `object do ... end` - defines nested structure
- `description: '...'` - hints for the AI about what to look for

On first run, Nukitori sends the HTML and schema to the LLM, which returns XPath rules. These rules are saved to `repos_schema.json` and reused for all subsequent pages.

## How Pagination Works

Notice the `next_page_url` field in the schema. On the first page, Nukitori's AI analyzes the HTML and extracts the XPath for the "Next" pagination link. This XPath gets saved to the schema file along with everything else.

On every subsequent page, the same XPath is applied to fresh HTML. As long as there's a "Next" link on the page, `next_page_url` returns its href. When you reach the last page and there's no "Next" element, the XPath returns `nil` - and the `while` loop exits.

Zero manual selectors. The AI figured out where the pagination link lives, and that knowledge is reused for the entire crawl.

## Why This Approach

1. **Zero selectors** - Describe what you want, not how to find it
2. **Fast after first run** - Cached XPath rules mean no more API calls
3. **Self-handling pagination** - Next page links are just another field in your schema
4. **Provider agnostic** - Switch between OpenAI, Anthropic, or Gemini with one config change

The generated schema file is human-readable JSON. You can inspect it, tweak the XPaths manually if needed, or version control it alongside your scraper.

## Using Nukitori with Kimurai Framework

If you're building production scrapers, [Kimurai](https://github.com/vifreefly/kimurai) is a full-featured web scraping framework for Ruby. Nukitori is integrated as a first-class citizen - just use the `extract` helper method with the same schema DSL.

```ruby
require 'kimurai'

# Configure once in your application:
Kimurai.configure do |config|
  config.default_model = 'gemini-3-flash-preview'
  config.gemini_api_key = ENV['GEMINI_API_KEY']
end

# Then use `extract` method in any spider:
class GithubSpider < Kimurai::Base
  @start_urls = ["https://github.com/search?q=kimurai&type=repositories"]
  @engine = :chrome
  @delay = 2

  def parse(response, url:, data: {})
    data = extract(response) do
      string :next_page_url, description: 'Next page path url'
      array :repos do
        object do
          string :name
          string :description, description: 'Repository short description'
          string :url
          string :stars
          string :language
          array :tags, of: :string
        end
      end
    end

    save_to "results.json", data[:repos], format: :json

    if data[:next_page_url]
      request_to :parse, url: absolute_url(data[:next_page_url], base: url)
    end
  end
end

GithubSpider.crawl!
```

Same zero-selector approach, but with Kimurai's built-in request queuing, rate limiting, data persistence, and browser management. The `extract` method handles schema caching automatically based on the spider name.
