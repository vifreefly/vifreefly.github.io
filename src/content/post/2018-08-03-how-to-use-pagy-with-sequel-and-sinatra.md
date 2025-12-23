---
title: "How to use Pagy with Sinatra and Sequel"
description: "Pagy is very effective and lightweight, so it’s a good idea to use it with Sinatra and Sequel ORM. We need to adjust some settings though, let’s see how to do it."
publishDate: "3 Aug 2018"
tags: ["ruby", "pagy", "sinatra", "sequel"]
---

[Pagy](https://github.com/ddnexus/pagy) is a modern pagination gem for Ruby. It works out of box with Rails and ActiveRecord (check out [Quick Start guide here](https://ddnexus.github.io/pagy/how-to)).

It’s a good idea to use Pagy with Sinatra and Sequel ORM. We need to adjust some settings though, let’s see how to do it.

<!--more--><br>

First add to the Gemfile `pagy` gem:

```
gem 'pagy'
```

app.rb:

```ruby
require 'sinatra/base'
require 'pagy'
require 'pagy/extras/bootstrap'

class App < Sinatra::Base
  include Pagy::Backend

  helpers do
    include Pagy::Frontend
  end

  get "/posts" do
    # where Post is a Sequel model
    @pagy, @posts = pagy(Post)
    erb :'posts/index'
  end

  private

  def pagy_get_vars(collection, vars)
    {
      count: collection.count,
      page: params["page"],
      items: vars[:items] || 25
    }
  end
end
```

views/posts/index.erb _(Also don’t forget to include views/layout.erb)_

```erb
<div class="row">
  <div class="col-lg-12">
    <h1>All Posts</h1>

    <% @posts.each do |post| %>
      <h2><%= post.title %></h2>
      <p><%= post.description %></p>
    <% end %>

    <%= pagy_nav_bootstrap(@pagy) if @pagy.pages > 1 %>
  </div>
</div>
```

Where:

* `include Pagy::Backend` [backend Pagy methods](https://ddnexus.github.io/pagy/api/backend) included to the controller
* Inside `helpers do` block we are including frontend pagy methods for views with extra [bootstrap pagination helper](https://ddnexus.github.io/pagy/extras/bootstrap).
* `def pagy_get_vars` it’s a special pagy method [to override default logic](https://ddnexus.github.io/pagy/how-to.html#using-the-pagy_info-helper) and tell pagy how to work with custom environment than Rails. **Count:** pagy uses `collection.count(:all)` to get total size of records of model (ActiveRecord). It didn’t work for Sequel and correct solution will be `collection.count`. **Page:** provide current page param.

<br>

That’s all, now run Sinatra app and go to `http://localhost:4567/posts?page=2` and you’ll see nice pagination made by Pagy:

![](https://cdn-images-1.medium.com/max/923/1*Y64bEapTtHfPVBYgK_Fs-Q.png)

> Comments at [Medium](https://medium.com/@vfreefly/how-to-use-pagy-with-sequel-and-sinatra-157dfec1c417)
