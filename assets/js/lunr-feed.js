var hostname = "https://victorafanasev.info";
var index = lunr(function () {
    this.field('title')
    this.field('content', {boost: 10})
    this.field('category')
    this.field('tags')
    this.ref('id')
});



    index.add({
      title: "Did you know that you can use Bundler without Gemfile?",
      category: ["tech"],
      content: "Did you know that you can use Bundler inside single Ruby script (without Gemfile) and automatically install required dependencies for it?\n\n# example.rb\n\nrequire 'bundler/inline'\n\ngemfile do\n  source 'https://rubygems.org'\n  gem 'rest-client'\n  gem 'nokogiri'\nend\n\n###\n\nbody = RestClient.get(\"https://www.reddit.com/r/ruby/\").body\n\nputs \"Posts from r/ruby front page:\"\nNokogiri::HTML(body).xpath(\"//div[contains(@class, 'scrollerItem')]//h2\").each do |h2|\n  puts h2.text.strip\nend\n\n\n\n\nRun ruby example.rb (without bundle exec), and enjoy!\n\nThis is a nice feature that I wasn’t aware of. Best to use for small scripts and quick sketches.\n\n\n  Bonus: use Sublime Text snippet to paste bundler inline code block using tab trigger:\n\n\n1. Open Tools &gt; Developer &gt; New Snippet\n\n2. Paste following code into the snippet file:\n\n&lt;snippet&gt;\n\t&lt;content&gt;&lt;![CDATA[\nrequire 'bundler/inline'\n\ngemfile do\n  source 'https://rubygems.org'\nend\n]]&gt;&lt;/content&gt;\n\t&lt;tabTrigger&gt;bun&lt;/tabTrigger&gt;\n\t&lt;scope&gt;source.ruby&lt;/scope&gt;\n&lt;/snippet&gt;\n\n\n3. Save snippet (ctrl+s). Now try to open a new empty file with .rb extension and type bun + Tab key. Bundle inline block template will be pasted into the file.\n",
      tags: ["ruby","bundler","gems"],
      id: 0
    });
    

    index.add({
      title: "VPN on Linux Ubuntu Desktop: user-friendly way",
      category: ["tech"],
      content: "What is better: VPN provider or own private VPN, based on VPS server? Even if it’s not a problem for you to manually setup the server (buy VPS and install/configure OpenVPN there), almost every VPN provider has multiple IP locations feature. In one click you can switch your location from USA/New York to Europe/Amsterdam and so on. In case of your own VPN, IP is always the same.\n\nThe sad thing is that many of VPN providers don’t have a client for Linux. Here are who does:\n\n\n  Nord VPN - CLI, OpenVPN\n  Tunnel Bear - OpenVPN support\n  ExpressVPN - CLI\n  Windscribe - CLI, OpenVPN\n  TorGuard - Client and OpenVPN\n  Know something else? Please tell in the comments below.\n\n\nRight after easy registration (you have to provide only account email and password, credit card in not required) Tunnel Bear gives you 512 mb for free.\n\nLet’s use it and see how to setup VPN on Ubuntu Desktop (18.04-18.10) in a few, user-friendly steps: \n\n1) Download Tunnel Bear configuration files from here https://s3.amazonaws.com/tunnelbear/linux/openvpn.zip\n\n2) Unzip openvpn.zip archive: Right click &gt; Extract Here\n\n3) Go to Settings &gt; Network &gt; VPN +, and select Import from file...\n\n\n\n4) Go to folder with configuration files and select one of them on your choice:\n\n\n\n5) Fill in your Tunnel Bear credentials to User name (account email) and Password (account password) fields and click Add\n\n6) Now you can connect to a VPN from topbar menu:\n\n\n\nIf all is fine, you will see VPN icon:\n\n\n\nAll done! You can add multiple VPN locations and switch between them from topbar or Network settings:\n\n\n\n\n  BTW, you can check your location here: https://bearsmyip.com/\n\n",
      tags: ["ubuntu-desktop","vpn","linux"],
      id: 1
    });
    

    index.add({
      title: "Capistrano: automatically check if remote origin updated before deploy",
      category: ["tech"],
      content: "Sometimes I forget to push local commits to the remote repository before $ bundle exec cap production deploy.\n\nIt is possible to check the git status before command, and if there are uncommited and/or unpushed changes, abort the deploy command. \n\nJust add following capistrano task to the lib/capistrano/tasks/deploy_git_uptodate_check.rake file:\n\n# lib/capistrano/tasks/deploy_git_uptodate_check.rake\n\nnamespace :deploy do\n  desc \"Check if origin master synced with local repository before deploy\"\n  task :git_uptodate_check do\n    if !`git status --short`.empty?\n      raise \"Please commit your changes first\"\n    elsif `git remote`.empty?\n      raise \"Please add remote origin repository to your repo first\"\n    elsif !`git rev-list master...origin/master`.empty?\n      raise \"Please push your commits to the remote origin repo first\"\n    end\n  end\nend\n\nbefore \"deploy\", \"deploy:git_uptodate_check\"\n\n\nAll is done!\n",
      tags: ["capistrano","rails","git","ruby","automation","devops"],
      id: 2
    });
    

    index.add({
      title: "Deploy Jekyll build to Github Pages using Git pre-push hook",
      category: ["tech"],
      content: "There are examples how to automatically deploy Jekyll site build using Git’s post-update or post-receive hooks which are server-side hooks.\n\nI think it’s much more simple to use pre-push client-side (executes on your desktop) hook to automatically push a new site build to Github Pages before pushing to your Jekyll project repository.\n\n\n\nExample:\n\nI have my Jekyll blog repository blog hosted on a private Bitbucket repo. As a webhosting for my compiled version of a blog $ bundle exec jekyll build I use github-pages (repo vifreefly.github.io).\n\nWhen I pushing a new commit (for example added new post under _posts/ directory) to remote blog origin, I want first to automatically build website (_site/ folder which stores compiled build by default) and push this build to vfreefly.github.io.\n\nIt’s easy to implement using pre-push git hook:\n\n#!/bin/bash\n# copy this to `.git/hooks/pre-push` hook file and make it executable: `$ chmod +x pre-push`\n\necho \"&gt; Hook started\"\n\n# Build a website to a standard _site directory\nbundle exec jekyll build\n\n# cd to the build folder\ncd _site\n\n# Init a new git repo inside `_site/` if it doesn't exists\nif [ ! -d \".git\" ]; then\n  git init\nfi\n\nif [[ ! $(git remote) ]]; then\n  # Add your github-pages repo (example https://github.com/vifreefly/vifreefly.github.io.git)\n  # as origin for `_site` if it's not added yet:\n  git remote add origin https://github.com/vifreefly/vifreefly.github.io.git\n  # and push build to the github-pages repo with --force\n  git add . &amp;&amp; git commit -m \"Build\" &amp;&amp; git push -u -f origin master\nelse\n  # Push build to the github-pages repo with --force\n  git add . &amp;&amp; git commit -m \"Build\" &amp;&amp; git push -f origin master\nfi\n\necho \"&lt; Hook finished\"\n\n\nWith this hook, when I’m doing $ git push origin master at Jekyll blog repository, a new build of a website pushes to Github Pages as well.\n\n\n  Also, you can use pre-push hook to push your blog to AWS S3 instead of github-pages for example.\n\n",
      tags: ["jekyll","automation","git","github-pages"],
      id: 3
    });
    

    index.add({
      title: "How to use Pagy with Sinatra and Sequel",
      category: ["tech"],
      content: "Pagy is a modern pagination gem for Ruby. It works out of box with Rails and ActiveRecord (check out Quick Start guide here).\n\nIt’s a good idea to use Pagy with Sinatra and Sequel ORM. We need to adjust some settings though, let’s see how to do it.\n\n\n\n\nFirst add to the Gemfile pagy gem:\n\ngem 'pagy'\n\n\napp.rb:\n\nrequire 'sinatra/base'\nrequire 'pagy'\nrequire 'pagy/extras/bootstrap'\n\nclass App &lt; Sinatra::Base\n  include Pagy::Backend\n\n  helpers do\n    include Pagy::Frontend\n  end\n\n  get \"/posts\" do\n    # where Post is a Sequel model\n    @pagy, @posts = pagy(Post)\n    erb :'posts/index'\n  end\n\n  private\n\n  def pagy_get_vars(collection, vars)\n    {\n      count: collection.count,\n      page: params[\"page\"],\n      items: vars[:items] || 25\n    }\n  end\nend\n\n\nviews/posts/index.erb (Also don’t forget to include views/layout.erb)\n\n&lt;div class=\"row\"&gt;\n  &lt;div class=\"col-lg-12\"&gt;\n    &lt;h1&gt;All Posts&lt;/h1&gt;\n\n    &lt;% @posts.each do |post| %&gt;\n      &lt;h2&gt;&lt;%= post.title %&gt;&lt;/h2&gt;\n      &lt;p&gt;&lt;%= post.description %&gt;&lt;/p&gt;\n    &lt;% end %&gt;\n\n    &lt;%= pagy_nav_bootstrap(@pagy) if @pagy.pages &gt; 1 %&gt;\n  &lt;/div&gt;\n&lt;/div&gt;\n\n\nWhere:\n\n\n  include Pagy::Backend backend Pagy methods included to the controller\n  Inside helpers do block we are including frontend pagy methods for views with extra bootstrap pagination helper.\n  def pagy_get_vars it’s a special pagy method to override default logic and tell pagy how to work with custom environment than Rails. Count: pagy uses collection.count(:all) to get total size of records of model (ActiveRecord). It didn’t work for Sequel and correct solution will be collection.count. Page: provide current page param.\n\n\n\n\nThat’s all, now run Sinatra app and go to http://localhost:4567/posts?page=2 and you’ll see nice pagination made by Pagy:\n\n\n\n\n  Comments at Medium\n\n",
      tags: ["ruby","pagy","sinatra","sequel"],
      id: 4
    });
    

    index.add({
      title: "How to use Sequel with ActiveRecord database",
      category: ["tech"],
      content: "Sometimes we want to query rails database outside of a rails app. But should you always bring AR for this? No, lightweight Sequel can handle this job pretty well. Check the guide Querying in Sequel to understand basics.\n\n1) Add to Gemfile gems pg and sequel:\n\n\n\ngem 'pg'\ngem 'sequel'\n\n\n2) Create module DB which contains AR models which you want to query. Sequel models have very similar syntax like ActiveRecord:\n\nrequire 'pg'\nrequire 'sequel'\n\nSequel.default_timezone = :utc\n\nmodule DB\n  URL = Sequel.connect(\"postgres://user:password@localhost/database_name\")\n\n  class Product &lt; Sequel::Model(URL)\n    plugin :timestamps, update_on_create: true\n    many_to_one :brand\n  end\n\n  class Brand &lt; Sequel::Model(URL)\n    plugin :timestamps, update_on_create: true\n    one_to_many :products\n  end\nend\n\n\n\n\nThis is it. Lets dig into details:\n\nSequel.default_timezone = :utc\n\n\nRails stores all dates in database using UTC format, where Sequel uses local time. We have to tell Sequel to use UTC instead.\n\n\n\nURL = Sequel.connect(\"postgres://user:password@localhost/database_name\")\n\n\nThis is a DATABASE_URL, format same as in Active Record. It is a good idea to put this string to .env file using Dotenv and then: URL = Sequel.connect(ENV[\"DATABASE_URL\"]).\n\n\n\nplugin :timestamps, update_on_create: true\n\n\nIf you want to create or update models as well, timestamps plugin will handle created_at and updated_at exact the same way as ActiveRecord.\n\n\n\nRelations, where one_to_many equal to AR’s belongs_to and many_to_one equal to AR’s has_many. Read about Sequel relations more here.\n\n\n\nAnd now you have everything to start:\n\nproduct = DB::Product.first\nproduct.brand\n# etc.\n\n\nThere is full Sequel documentation http://sequel.jeremyevans.net/documentation.html.\n\n\n\nAlso, Sequel works with threads a bit simpler than ActiveRecord. If you ever tried to query AR inside threads, you know that connection pool can easy exceed and AR will raise an exception. That’s why in such cases all code which works with AR inside of threads should be wrapped to\n\nActiveRecord::Base.connection_pool.with_connection do\n  # Do stuff\nend\n\n\nblock.\n\nSequel does this automatically for you. You don’t have to do anything, and this is great. Read about it more here: Why you should stop using ActiveRecord and start using Sequel (“Threading” part).\n",
      tags: ["ruby","sequel","postgres","RoR","ActiveRecord"],
      id: 5
    });
    

    index.add({
      title: "Increase readability of your bash scripts using functions",
      category: ["tech"],
      content: "You can find it very obvious, but there are tons of bash scripts out there written very badly.\n\nPeople often forget that Bash actually a programming language. And just like JavaScript, Python, Ruby, GoLang and many others languages, Bash language has functions.\n\nLet’s check simple bash function which prints green string taken as an argument:\n\nlogger() {\n  local GREEN=\"\\033[1;32m\"\n  local NC=\"\\033[00m\"\n\n  echo -e \"${GREEN}Logger: $1 ${NC}\"\n}\n\n\n\n\nFirst two variables it’s ANSI color codes, I used green color here to make logger message colored.\n\nWhat’s interesting here it’s how functions take parameters/arguments. Simply, they don’t. You can’t specify arguments while declaring function, but it’s still possible to use passed arguments in function body calling them $1 , $2 , $3 , etc:\n\nhello() {\n  echo \"Hello,\" $1\n}\n\n$ hello world\n# prints: Hello, world\n\n\nSo thats how logger() function works.\n\n\n\n\n\nNow when we understood how to write functions, it’s time to see how we can use them for good.\n\nLet’s write bash automation script which installs all required modern ruby environment on Ubuntu 16.04 — 18.04:\n\n\n  Latest ruby version using Rbenv\n  Bundler gem (to manage ruby dependencies)\n\n\nAll required steps for script takes from awesome gorails manual Setup Ruby On Rails on Ubuntu 18.04 Bionic Beaver\n\nHere is a full script: ruby_install.sh:\n\n#!/bin/bash\n\n# check latest here https://www.ruby-lang.org/en/downloads/releases/\nRUBY_VERSION=2.5.1\n\nlogger() {\n  local GREEN=\"\\033[1;32m\"\n  local NC=\"\\033[00m\"\n  echo -e \"${GREEN}Logger: $1 ${NC}\"\n}\n\nruby_compiling_dependencies_install() {\n  logger \"Installing ruby build dependencies...\"\n  sudo apt install -q -y zlib1g-dev build-essential libssl-dev libreadline-dev libreadline6-dev libyaml-dev libxml2-dev libxslt1-dev libcurl4-openssl-dev libffi-dev\n}\n\nrbenv_install() {\n  logger \"Installing rbenv...\"\n\n  cd &amp;&amp; rm -rf ~/.rbenv\n  git clone https://github.com/sstephenson/rbenv.git ~/.rbenv\n  git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build\n\n\n  echo 'export PATH=\"$HOME/.rbenv/bin:$PATH\"' &gt;&gt; ~/.bashrc\n  echo 'eval \"$(rbenv init -)\"' &gt;&gt; ~/.bashrc\n\n  # export rbenv path for further ruby installation using rbenv\n  export PATH=\"$HOME/.rbenv/bin:$PATH\"\n}\n\nruby_version_install() {\n  logger \"Installing ruby ${RUBY_VERSION}...\"\n\n  export CONFIGURE_OPTS=\"--disable-install-doc\"\n  rbenv install $RUBY_VERSION\n\n  logger \"Enabling ruby ${RUBY_VERSION} as global version...\"\n  rbenv global $RUBY_VERSION\n\n  rbenv rehash\n}\n\nbundler_install() {\n  # gems config, disable downloading gems documentation\n  echo \"gem: --no-ri --no-rdoc\" &gt; ~/.gemrc &amp;&amp; chmod 644 ~/.gemrc\n\n  # install bundler\n  logger \"Installing bundler...\"\n  rbenv exec gem install bundler\n\n  # bundler config, allow to install gems from insecure sources (git)\n  rbenv exec bundle config --global git.allow_insecure true\n  # enable parallel gems installation (4 in parallel)\n  rbenv exec bundle config --global jobs 4\n}\n\nmain() {\n  ruby_compiling_dependencies_install\n  rbenv_install\n  ruby_version_install\n  bundler_install\n\n  logger \"All done! Don't forget to reload env variables in your terminal session: '\\$ exec \\$SHELL'\"\n}\n\nmain\n\n\nStep by step:\n\n#!/bin/bash — at the beginning of the script there is shebang.\n\nNext there is logger function just for convenience, to control script execution process:\n\nlogger() {\n  local GREEN=\"\\033[1;32m\"\n  local NC=\"\\033[00m\"\n  echo -e \"${GREEN}Logger: $1 ${NC}\"\n}\n\n\nTo compile and install ruby version, first we need to install all required packages:\n\nruby_compiling_dependencies_install() {\n  logger \"Installing ruby build dependencies...\"\n  sudo apt install -q -y zlib1g-dev build-essential libssl-dev libreadline-dev libreadline6-dev libyaml-dev libxml2-dev libxslt1-dev libcurl4-openssl-dev libffi-dev\n}\n\n\nNext we are going to install Rbenv, wrapping all required steps for this in the function rbenv_install:\n\nrbenv_install() {\n  logger \"Installing rbenv...\"\n\n  cd &amp;&amp; rm -rf ~/.rbenv\n  git clone https://github.com/sstephenson/rbenv.git ~/.rbenv\n  git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build\n\n  echo 'export PATH=\"$HOME/.rbenv/bin:$PATH\"' &gt;&gt; ~/.bashrc\n  echo 'eval \"$(rbenv init -)\"' &gt;&gt; ~/.bashrc\n\n  # export rbenv path for further ruby installation using rbenv\n  export PATH=\"$HOME/.rbenv/bin:$PATH\"\n}\n\n\nAfter successfully installing Rbenv, we can install Ruby itself:\n\nruby_version_install() {\n  logger \"Installing ruby ${RUBY_VERSION}...\"\n\n  export CONFIGURE_OPTS=\"--disable-install-doc\"\n  rbenv install $RUBY_VERSION\n\n  logger \"Enabling ruby ${RUBY_VERSION} as global version...\"\n  rbenv global $RUBY_VERSION\n\n  rbenv rehash\n}\n\n\nLast step is to install Bundler gem, since it’s very common dependency manager in the Ruby world:\n\nbundler_install() {\n  # gems config, disable downloading gems documentation\n  echo \"gem: --no-ri --no-rdoc\" &gt; ~/.gemrc &amp;&amp; chmod 644 ~/.gemrc\n\n  logger \"Installing bundler...\"\n  rbenv exec gem install bundler\n\n  # bundler config, allow to install gems from insecure sources (git)\n  rbenv exec bundle config --global git.allow_insecure true\n  # enable parallel gems installation (4 in parallel)\n  rbenv exec bundle config --global jobs 4\n}\n\n\nAfter all functions declared, it’s good practice to wrap everything to the main function:\n\nmain() {\n  ruby_compiling_dependencies_install\n  rbenv_install\n  ruby_version_install\n  bundler_install\n\n  logger \"All done! Don't forget to reload env variables in your terminal session: '\\$ exec \\$SHELL'\"\n}\n\n\nAnd at the end call this main function:\n\nmain\n\n\n\n\nAll done! You can execute bash script using two ways:\n\n  First way is to execute script by passing path to the script to the bash interpreter: $ bash ruby_install.sh.\n  Second way is to make script executable first: $ chmod +x ruby_install.sh and then just call script: $ ./ruby_install.sh.\n\n",
      tags: ["linux","bash","devops","automation"],
      id: 6
    });
    

    index.add({
      title: "Create free HTTPS/SOCKS5 proxy servers using AWS Free Tier EC2 instances automatically with Terraform",
      category: ["tech"],
      content: "For scraping purposes, I need good quality proxies every day for 1–2 hours, when my web crawlers are running. I don’t need proxies 24/hours per day.\n\nSo it makes sense to use AWS EC2 t2.nano/t2.micro instances for proxy servers and create/destroy them on demand within HTTP API.\n\n\n\nBenefits of this approach:\n\n  If you are not reached AWS Free Tier yet, that means you have 750 hours and 15 GB of outbound traffic per month for free, for up to 20 EC2 instances (VPS servers) running at the same time. For example, you’ll spend only 600 hours/month, if you need 20 proxies per day for a one hour (20 x 1 x 30 = 600).\n  When you’ll exceed 15 GB/month free tier limit of outbound traffic, AWS will charge you only $0.090 per additional GB. I think it’s pretty cheap.\n  Each new instance (or instance which was stopped and started again) will get a random IPv4 address from pool, so each time we’ll have fresh proxy IP’s.\n\n\nEven if free tier is not available for you, price for EC2 t2.nano instance is only $0.0058 per Hour, and price for 1 GB outbound traffic is $0.090.\n\nTo automate the process of creation EC2 instances and installation proxy server software, I used next tools:\n\n  Terraform to automatically create/install software/destroy EC2 instances\n  Goproxy for a proxy server. Simple but powerful: one-line command installation, zero configuration. HTTPS, SOCKS5 proxy with optional authorization out of box\n  Ruby Sinatra gem for HTTP API to manage proxy instances (optional)\n  Ubuntu 16.04 server\n  Systemd to convert goproxy process to the system daemon service\n\n\nTo give a try, check the project repo on github here: https://github.com/vifreefly/ec2_proxies\n",
      tags: ["aws","linux","terraform","automation","devops"],
      id: 7
    });
    

    index.add({
      title: "How to create AWS restricted credentials (example for s3)",
      category: ["tech"],
      content: "1) Go to https://console.aws.amazon.com/iam/home?#/users and create new user then press next\n\n\n\n2) Set permissions for your user by Attach one or more existing policies directly and then press next\n\n\n\n\n\n3) Check if everything is ok and press create user\n\n4)  All done, save your Access key ID and Secret access key\n\n\n\nYou can see all your credentials here https://console.aws.amazon.com/iam/home?#/users (1 user = 1 credential)\n\n\n\nNow you can use this credential and it will have access only for s3 operations, all other operations will fail to process (like creating EC2 instances).\n\nIt is good practice to use different (and restricted) credentials (that means different users, because 1 user = 1 credential) for different apps so you can always control all your AWS usage per app.\n\nAdditional reading:\n\n  Restrict Steps https://www.netguru.co/blog/my-first-5-minutes-on-an-aws-account\n  Best Security Practices by amazon https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html?icmpid=docs_iam_console\n\n",
      tags: ["devops","aws"],
      id: 8
    });
    

    index.add({
      title: "Simplest configuration block implementation for a ruby gem ever",
      category: ["tech"],
      content: "For my own gems, I want to have a configuration block, which usually looks like this:\n\nYourgem.configure do |config|\n  config.some_config = \"foobarbaz\"\nend\n\n\n\n\nThere are a lot of articles how to implement this functionality:\n\n  Ruby Gem Configuration Patterns\n  MyGem.configure Block\n  Creating a configurable Ruby gem\n  RubyGem Configuration Pattern\n  The easiest configuration block for your Ruby gems\n  Ruby Gem Configuration Pattern\n  …\n\n\nIsn’t it still looks too complicated? Can’t be a configuration object just a plain ruby hash?\n\nYes, it can:\n\nmodule Yourgem\n  def self.configuration\n    @configuration ||= {}\n  end\n\n  def self.configure\n    yield(configuration)\n  end\nend\n\n\nAnd now:\n\nYourgem.configure do |config|\n  config[:some_config] = \"foobarbaz\"\nend\n\nYourgem.configuration # =&gt; { :some_config =&gt; \"foobarbaz\" }\nYourgem.configuration[:some_config] #=&gt; \"foobarbaz\"\n\n\nLooks clean and simple, but there is one restriction: instead of classy Yourgem.configuration.some_config we have to act with it like with hash (because configuration value it’s a hash): Yourgem.configuration[:some_config]. To solve this problem, we’ll use Ruby’s built-in OpenStruct:\n\nrequire 'ostruct'\n\nmodule Yourgem\n  def self.configuration\n    @configuration ||= OpenStruct.new\n  end\n\n  def self.configure\n    yield(configuration)\n  end\nend\n\n\nAnd now:\n\nYourgem.configure do |config|\n  config.some_config = \"foobarbaz\"\nend\n\nYourgem.configuration # =&gt; #&lt;OpenStruct some_config=\"foobarbaz\"&gt;\nYourgem.configuration.some_config #=&gt; \"foobarbaz\"\n\n\nClean and simple.\n\n\n  Comments at Medium.\n\n",
      tags: ["ruby","gems"],
      id: 9
    });
    


var store = [{
    "title": "Did you know that you can use Bundler without Gemfile?",
    "link": "/tech/you-can-use-bundler-without-gemfile",
    "image": null,
    "date": "January 5, 2019",
    "category": ["tech"],
    "excerpt": "Did you know that you can use Bundler inside single Ruby script (without Gemfile) and automatically install required dependencies for..."
},{
    "title": "VPN on Linux Ubuntu Desktop: user-friendly way",
    "link": "/tech/vpn-on-ubuntu-desktop-the-user-friendly-way",
    "image": null,
    "date": "November 13, 2018",
    "category": ["tech"],
    "excerpt": "What is better: VPN provider or own private VPN, based on VPS server? Even if it’s not a problem for..."
},{
    "title": "Capistrano: automatically check if remote origin updated before deploy",
    "link": "/tech/capistrano-automatically-check-if-remote-origin-updated-before-deploy",
    "image": null,
    "date": "October 7, 2018",
    "category": ["tech"],
    "excerpt": "Sometimes I forget to push local commits to the remote repository before $ bundle exec cap production deploy. It is..."
},{
    "title": "Deploy Jekyll build to Github Pages using Git pre-push hook",
    "link": "/tech/deploy-jekyll-build-to-github-pages-using-git-pre-push-hook",
    "image": null,
    "date": "August 9, 2018",
    "category": ["tech"],
    "excerpt": "There are examples how to automatically deploy Jekyll site build using Git’s post-update or post-receive hooks which are server-side hooks...."
},{
    "title": "How to use Pagy with Sinatra and Sequel",
    "link": "/tech/how-to-use-pagy-with-sequel-and-sinatra",
    "image": null,
    "date": "August 3, 2018",
    "category": ["tech"],
    "excerpt": "Pagy is a modern pagination gem for Ruby. It works out of box with Rails and ActiveRecord (check out Quick..."
},{
    "title": "How to use Sequel with ActiveRecord database",
    "link": "/tech/how-to-use-sequel-with-activerecord-database",
    "image": null,
    "date": "July 13, 2018",
    "category": ["tech"],
    "excerpt": "Sometimes we want to query rails database outside of a rails app. But should you always bring AR for this?..."
},{
    "title": "Increase readability of your bash scripts using functions",
    "link": "/tech/increase-readability-of-your-bash-scripts-using-functions",
    "image": null,
    "date": "June 21, 2018",
    "category": ["tech"],
    "excerpt": "You can find it very obvious, but there are tons of bash scripts out there written very badly. People often..."
},{
    "title": "Create free HTTPS/SOCKS5 proxy servers using AWS Free Tier EC2 instances automatically with Terraform",
    "link": "/tech/create-free-https-socks5-proxy-servers-using-free-ec2-automatically",
    "image": null,
    "date": "June 11, 2018",
    "category": ["tech"],
    "excerpt": "For scraping purposes, I need good quality proxies every day for 1–2 hours, when my web crawlers are running. I..."
},{
    "title": "How to create AWS restricted credentials (example for s3)",
    "link": "/tech/how-to-create-aws-restricted-credentials-example-for-s3",
    "image": null,
    "date": "June 6, 2018",
    "category": ["tech"],
    "excerpt": "1) Go to https://console.aws.amazon.com/iam/home?#/users and create new user then press next 2) Set permissions for your user by Attach one..."
},{
    "title": "Simplest configuration block implementation for a ruby gem ever",
    "link": "/tech/the-most-simple-configuration-block-implementation-for-a-ruby-gem",
    "image": null,
    "date": "May 9, 2018",
    "category": ["tech"],
    "excerpt": "For my own gems, I want to have a configuration block, which usually looks like this: Yourgem.configure do |config| config.some_config..."
}]

$(document).ready(function() {
    $('#search-input').on('keyup', function () {
        var resultdiv = $('#results-container');
        if (!resultdiv.is(':visible'))
            resultdiv.show();
        var query = $(this).val();
        var result = index.search(query);
        resultdiv.empty();
        $('.show-results-count').text(result.length + ' Results');
        for (var item in result) {
            var ref = result[item].ref;
            var searchitem = '<li><a href="'+ hostname + store[ref].link+'">'+store[ref].title+'</a></li>';
            resultdiv.append(searchitem);
        }
    });
});