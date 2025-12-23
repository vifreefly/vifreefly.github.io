---
title: "Did you know that you can use Bundler without Gemfile?"
description: "Did you know that it's possible to use Bundler with a single Ruby script and without Gemfile?"
publishDate: "5 Jan 2019"
tags: ["ruby", "bundler", "gems"]
---

Did you know that [you can use Bundler inside single Ruby script](https://bundler.io/v2.0/guides/bundler_in_a_single_file_ruby_script.html) (without Gemfile) and automatically install required dependencies for it?

```ruby
# example.rb

require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'rest-client'
  gem 'nokogiri'
end

###

body = RestClient.get("https://www.reddit.com/r/ruby/").body

puts "Posts from r/ruby front page:"
Nokogiri::HTML(body).xpath("//div[contains(@class", "scrollerItem')]//h2").each do |h2|
  puts h2.text.strip
end
```

<!--more-->

Run `ruby example.rb` (without bundle exec), and enjoy!

This is a nice feature that I wasn't aware of. Best to use for small scripts and quick sketches.


## Bonus: use Sublime Text snippet to paste `bundler inline` code block using tab trigger

**1.** Open `Tools` > `Developer` > `New Snippet`

**2.** Paste following code into the snippet file:

```
<snippet>
	<content><![CDATA[
require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'
end
]]></content>
	<tabTrigger>bun</tabTrigger>
	<scope>source.ruby</scope>
</snippet>
```

**3.** Save snippet (ctrl+s). Now try to open a new empty file with `.rb` extension and type `bun` + `Tab` key. Bundle inline block template will be pasted into the file.
