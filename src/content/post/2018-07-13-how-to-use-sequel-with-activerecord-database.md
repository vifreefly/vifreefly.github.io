---
title: "How to use Sequel with ActiveRecord database"
description: "Sometimes we want to query rails database outside of a rails app. But should you always bring AR for this? No, lightweight Sequel can handle this job pretty well. Check the guide Querying in Sequel to understand basics."
publishDate: "13 Jul 2018"
tags: ["ruby", "sequel", "postgres", "RoR", "ActiveRecord"]
---

Sometimes we want to query rails database outside of a rails app. But should you always bring AR for this? No, lightweight [Sequel](https://github.com/jeremyevans/sequel) can handle this job pretty well. **Check the guide [Querying in Sequel](http://sequel.jeremyevans.net/rdoc/files/doc/querying_rdoc.html)** to understand basics.

1) Add to Gemfile gems pg and sequel:

<!--more-->

```ruby
gem 'pg'
gem 'sequel'
```

2) Create module `DB` which contains AR models which you want to query. Sequel models have very similar syntax like ActiveRecord:

```ruby
require 'pg'
require 'sequel'

Sequel.default_timezone = :utc

module DB
  URL = Sequel.connect("postgres://user:password@localhost/database_name")

  class Product < Sequel::Model(URL)
    plugin :timestamps, update_on_create: true
    many_to_one :brand
  end

  class Brand < Sequel::Model(URL)
    plugin :timestamps, update_on_create: true
    one_to_many :products
  end
end
```

<br>

This is it. **Lets dig into details:**

```ruby
Sequel.default_timezone = :utc
```

Rails stores all dates in database using UTC format, where Sequel uses local time. We have to tell Sequel to use UTC instead.

<br>

```ruby
URL = Sequel.connect("postgres://user:password@localhost/database_name")
```

This is a `DATABASE_URL`, format same as in Active Record. It is a good idea to put this string to `.env` file using Dotenv and then: `URL = Sequel.connect(ENV["DATABASE_URL"])`.

<br>

```ruby
plugin :timestamps, update_on_create: true
```

If you want to create or update models as well, timestamps plugin will handle `created_at` and `updated_at` exact the same way as ActiveRecord.

<br>

Relations, where `one_to_many` equal to AR’s `belongs_to` and `many_to_one` equal to AR’s `has_many`. Read about Sequel relations more [here](http://sequel.jeremyevans.net/rdoc/files/doc/association_basics_rdoc.html).

<br>

And now you have everything to start:

```ruby
product = DB::Product.first
product.brand
# etc.
```

There is full **Sequel documentation** <http://sequel.jeremyevans.net/documentation.html>.

<br>

Also, Sequel works with threads a bit simpler than ActiveRecord. If you ever tried to query AR inside threads, you know that connection pool can easy exceed and AR will raise an exception. That’s why in such cases all code which works with AR inside of threads should be wrapped to

```ruby
ActiveRecord::Base.connection_pool.with_connection do
  # Do stuff
end
```

block.

Sequel does this automatically for you. You don’t have to do anything, and this is great. Read about it more here: [Why you should stop using ActiveRecord and start using Sequel](https://mrbrdo.wordpress.com/2013/10/15/why-you-should-stop-using-activerecord-and-start-using-sequel/) (“Threading” part).
