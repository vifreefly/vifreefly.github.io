---
title: "Simplest configuration block implementation for a ruby gem ever"
description: "A minimal approach to creating configuration blocks for Ruby gems using plain hashes instead of complex patterns."
publishDate: "9 May 2018"
tags: ["ruby", "gems"]
---

For my own gems, I want to have a configuration block, which usually looks like this:

```ruby
Yourgem.configure do |config|
  config.some_config = "foobarbaz"
end
```

There are a lot of articles how to implement this functionality:
* [Ruby Gem Configuration Patterns](https://brandonhilkert.com/blog/ruby-gem-configuration-patterns/)
* [MyGem.configure Block](https://robots.thoughtbot.com/mygem-configure-block)
* [Creating a configurable Ruby gem](http://lizabinante.com/blog/creating-a-configurable-ruby-gem/)
* [RubyGem Configuration Pattern](https://juanitofatas.com/blog/2015/05/19/rubygem_configuration_pattern)
* [The easiest configuration block for your Ruby gems](https://www.skcript.com/svr/the-easiest-configuration-block-for-your-ruby-gems/)
* [Ruby Gem Configuration Pattern](https://blog.toshimaru.net/ruby-configuration-pattern/)
* ...

Isn’t it still looks too complicated? Can’t be a configuration object just a plain ruby hash?

Yes, it can:

```ruby
module Yourgem
  def self.configuration
    @configuration ||= {}
  end

  def self.configure
    yield(configuration)
  end
end
```

And now:

```ruby
Yourgem.configure do |config|
  config[:some_config] = "foobarbaz"
end

Yourgem.configuration # => { :some_config => "foobarbaz" }
Yourgem.configuration[:some_config] #=> "foobarbaz"
```

Looks clean and simple, but there is one restriction: instead of classy `Yourgem.configuration.some_config` we have to act with it like with hash (because configuration value it’s a hash): `Yourgem.configuration[:some_config]`. To solve this problem, we'll use Ruby’s built-in [OpenStruct](https://ruby-doc.org/stdlib-2.0.0/libdoc/ostruct/rdoc/OpenStruct.html):

```ruby
require 'ostruct'

module Yourgem
  def self.configuration
    @configuration ||= OpenStruct.new
  end

  def self.configure
    yield(configuration)
  end
end
```

And now:

```ruby
Yourgem.configure do |config|
  config.some_config = "foobarbaz"
end

Yourgem.configuration # => #<OpenStruct some_config="foobarbaz">
Yourgem.configuration.some_config #=> "foobarbaz"
```

Clean and simple.

Comments at [Medium](https://medium.com/@vfreefly/the-most-simple-configuration-block-implementation-for-a-ruby-gem-815fe1dad5dc).
