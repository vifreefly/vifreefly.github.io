---
title: "Capistrano: automatically check if remote origin updated before deploy"
publishDate: "7 Oct 2018"
tags: ["capistrano", "rails", "git", "ruby", "automation", "devops"]
description: "Prevent deployment issues by automatically checking if your local repository is in sync with remote origin before deploying with Capistrano."
---

Sometimes I forget to push local commits to the remote repository before `$ bundle exec cap production deploy`.

It is possible to check the `git status` before command, and if there are uncommited and/or unpushed changes, abort the deploy command. <!--more-->

Just add following capistrano task to the `lib/capistrano/tasks/deploy_git_uptodate_check.rake` file:

```ruby
# lib/capistrano/tasks/deploy_git_uptodate_check.rake

namespace :deploy do
  desc "Check if origin master synced with local repository before deploy"
  task :git_uptodate_check do
    if !`git status --short`.empty?
      raise "Please commit your changes first"
    elsif `git remote`.empty?
      raise "Please add remote origin repository to your repo first"
    elsif !`git rev-list master...origin/master`.empty?
      raise "Please push your commits to the remote origin repo first"
    end
  end
end

before "deploy", "deploy:git_uptodate_check"
```

All is done!
