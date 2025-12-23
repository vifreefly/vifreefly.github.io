---
title: "Increase readability of your bash scripts using functions"
description: "People often forget that Bash actually a programming language. And just like JavaScript, Python, Ruby, GoLang and many others languages, Bash language has functions."
publishDate: "21 Jun 2018"
tags: ["linux", "bash", "devops", "automation"]
---

You can find it very obvious, but there are tons of bash scripts out there written very badly.

People often forget that Bash [actually a programming language](https://stackoverflow.com/questions/28693737/is-bash-a-programming-language). And just like [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions), [Python](https://docs.python.org/2.4/lib/typesmethods.html), [Ruby](http://rubylearning.com/satishtalim/writing_own_ruby_methods.html), [GoLang](https://tour.golang.org/basics/4) and many others languages, Bash language has functions.

Let’s check simple bash function which prints green string taken as an argument:

```bash
logger() {
  local GREEN="\033[1;32m"
  local NC="\033[00m"

  echo -e "${GREEN}Logger: $1 ${NC}"
}
```

<!--more-->

First two variables it’s [ANSI color codes](https://en.wikipedia.org/wiki/ANSI_escape_code#Colors), I used green color here to make logger message colored.

What’s interesting here it’s how functions take parameters/arguments. Simply, they don’t. You can’t specify arguments while declaring function, but it’s still possible to use passed arguments in function body calling them `$1` , `$2` , `$3` , etc:

```bash
hello() {
  echo "Hello," $1
}

$ hello world
# prints: Hello, world
```

So thats how `logger()` function works.

![](https://cdn-images-1.medium.com/max/923/1*rUUpGX3bTI-H0Uc5oaWqMA.png)

<br>

Now when we understood how to write functions, **it’s time to see** how we can use them for good.

Let’s write bash automation script which installs all required modern ruby environment on Ubuntu 16.04 — 18.04:

* Latest ruby version using [Rbenv](https://github.com/rbenv/rbenv)
* [Bundler](https://bundler.io/) gem (to manage ruby dependencies)

All required steps for script takes from awesome gorails manual [Setup Ruby On Rails on Ubuntu 18.04 Bionic Beaver](https://gorails.com/setup/ubuntu/18.04)

Here is a full script: [ruby_install.sh](https://gist.github.com/vfreefly/77dc46d7d9ef3b0a6c17debfdfb73eb5):

```bash
#!/bin/bash

# check latest here https://www.ruby-lang.org/en/downloads/releases/
RUBY_VERSION=2.5.1

logger() {
  local GREEN="\033[1;32m"
  local NC="\033[00m"
  echo -e "${GREEN}Logger: $1 ${NC}"
}

ruby_compiling_dependencies_install() {
  logger "Installing ruby build dependencies..."
  sudo apt install -q -y zlib1g-dev build-essential libssl-dev libreadline-dev libreadline6-dev libyaml-dev libxml2-dev libxslt1-dev libcurl4-openssl-dev libffi-dev
}

rbenv_install() {
  logger "Installing rbenv..."

  cd && rm -rf ~/.rbenv
  git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
  git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build


  echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
  echo 'eval "$(rbenv init -)"' >> ~/.bashrc

  # export rbenv path for further ruby installation using rbenv
  export PATH="$HOME/.rbenv/bin:$PATH"
}

ruby_version_install() {
  logger "Installing ruby ${RUBY_VERSION}..."

  export CONFIGURE_OPTS="--disable-install-doc"
  rbenv install $RUBY_VERSION

  logger "Enabling ruby ${RUBY_VERSION} as global version..."
  rbenv global $RUBY_VERSION

  rbenv rehash
}

bundler_install() {
  # gems config, disable downloading gems documentation
  echo "gem: --no-ri --no-rdoc" > ~/.gemrc && chmod 644 ~/.gemrc

  # install bundler
  logger "Installing bundler..."
  rbenv exec gem install bundler

  # bundler config, allow to install gems from insecure sources (git)
  rbenv exec bundle config --global git.allow_insecure true
  # enable parallel gems installation (4 in parallel)
  rbenv exec bundle config --global jobs 4
}

main() {
  ruby_compiling_dependencies_install
  rbenv_install
  ruby_version_install
  bundler_install

  logger "All done! Don't forget to reload env variables in your terminal session: '\$ exec \$SHELL'"
}

main
```

**Step by step:**

`#!/bin/bash` — at the beginning of the script there is [shebang](https://en.wikipedia.org/wiki/Shebang_%28Unix%29).

Next there is logger function just for convenience, to control script execution process:

```bash
logger() {
  local GREEN="\033[1;32m"
  local NC="\033[00m"
  echo -e "${GREEN}Logger: $1 ${NC}"
}
```

To compile and install ruby version, first we need to install all required packages:

```bash
ruby_compiling_dependencies_install() {
  logger "Installing ruby build dependencies..."
  sudo apt install -q -y zlib1g-dev build-essential libssl-dev libreadline-dev libreadline6-dev libyaml-dev libxml2-dev libxslt1-dev libcurl4-openssl-dev libffi-dev
}
```

Next we are going to install Rbenv, wrapping all required steps for this in the function `rbenv_install`:

```bash
rbenv_install() {
  logger "Installing rbenv..."

  cd && rm -rf ~/.rbenv
  git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
  git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build

  echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
  echo 'eval "$(rbenv init -)"' >> ~/.bashrc

  # export rbenv path for further ruby installation using rbenv
  export PATH="$HOME/.rbenv/bin:$PATH"
}
```

After successfully installing Rbenv, we can install Ruby itself:

```bash
ruby_version_install() {
  logger "Installing ruby ${RUBY_VERSION}..."

  export CONFIGURE_OPTS="--disable-install-doc"
  rbenv install $RUBY_VERSION

  logger "Enabling ruby ${RUBY_VERSION} as global version..."
  rbenv global $RUBY_VERSION

  rbenv rehash
}
```

Last step is to install Bundler gem, since it’s very common dependency manager in the Ruby world:

```bash
bundler_install() {
  # gems config, disable downloading gems documentation
  echo "gem: --no-ri --no-rdoc" > ~/.gemrc && chmod 644 ~/.gemrc

  logger "Installing bundler..."
  rbenv exec gem install bundler

  # bundler config, allow to install gems from insecure sources (git)
  rbenv exec bundle config --global git.allow_insecure true
  # enable parallel gems installation (4 in parallel)
  rbenv exec bundle config --global jobs 4
}
```

After all functions declared, it’s good practice to wrap everything to the main function:

```bash
main() {
  ruby_compiling_dependencies_install
  rbenv_install
  ruby_version_install
  bundler_install

  logger "All done! Don't forget to reload env variables in your terminal session: '\$ exec \$SHELL'"
}
```

And at the end call this main function:

```bash
main
```

<br>

All done! **You can execute bash script** using two ways:
* First way is to execute script by passing path to the script to the bash interpreter: `$ bash ruby_install.sh`.
* Second way is to make script executable first: `$ chmod +x ruby_install.sh` and then just call script: `$ ./ruby_install.sh`.
