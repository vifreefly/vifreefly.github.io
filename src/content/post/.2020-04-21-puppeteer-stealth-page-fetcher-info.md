---
title: "Puppeteer Stealth Page Fetcher Info"
description: '""'
publishDate: "21 Apr 2020"
tags: ["node", "puppeteer", "automation", "tech"]
---

During the web scraping using Selenium or Headless Chrome, some websites can recognize that they are visited by an automated browser and then block it (there are ready to use services to protect websites from webscraping, for example like [Distil](https://www.imperva.com/products/bot-management/)).

It happends because browser environment in automation mode is different than in the normal one. There are possible ways how to change the environment so it will look similar to a normal non-automated browser, you can read more info about it in the following articles:

* <https://intoli.com/blog/making-chrome-headless-undetectable/>
* <https://intoli.com/blog/not-possible-to-block-chrome-headless/>

At the moment, the most modern and well-used Automation Browser API is Puppeteer for Headless Chrome. It is also has a lot of useful options which gives the possibility to change the browser environment. On the other hand, there is Selenium, which is less configurable, has less settings to tweak and in general not a good fit for web scraping/web automation if we want to hide the fact that browser is automated.

Puppeteer also has ready to use plugins which allows to mimic the normal non-automated browser like this one <https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth> .

I've build a [simple Puppeteer (with puppeteer-extra-plugin-stealth enabled) script](https://github.com/vifreefly/Puppeteer-Stealth-Page-Fetcher) which can be called from a command line with a provided webpage url and will print HTML DOM output back to the console. It's as easy as:

```bash
$ node page_fetcher.js --url "https://www.google.com/"

# <html>...</html>
```

You can also can it from any other programming language, here is an example for Ruby:

```ruby
html = `node page_fetcher.js --url "https://www.google.com/"`
```

Multiple options are supported, like providing a user-agent, proxy, custom delay, make a screenshot or run in a visible mode (for debug). Check it out here: <https://github.com/vifreefly/Puppeteer-Stealth-Page-Fetcher> .
