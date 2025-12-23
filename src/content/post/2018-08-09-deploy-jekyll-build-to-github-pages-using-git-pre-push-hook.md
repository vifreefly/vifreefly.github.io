---
title: "Deploy Jekyll build to Github Pages using Git pre-push hook"
publishDate: "9 Aug 2018"
tags: ["jekyll", "automation", "git", "github-pages"]
description: There are examples how to automatically deploy Jekyll site build using Git's or hooks which are server-side hooks.
---

[There are examples](https://jekyllrb.com/docs/deployment-methods/#git-post-update-hook) how to automatically deploy Jekyll site build using Git's `post-update` or `post-receive` hooks which are [server-side hooks](https://www.digitalocean.com/community/tutorials/how-to-use-git-hooks-to-automate-development-and-deployment-tasks#basic-idea-with-git-hooks).

I think it's much more simple to use `pre-push` client-side (executes on your desktop) hook to automatically push a new site build to [Github Pages](https://pages.github.com/) before pushing to your Jekyll project repository.

<!--more-->

**Example:**

I have my Jekyll blog repository `blog` hosted on a private Bitbucket repo. As a webhosting for my compiled version of a blog `$ bundle exec jekyll build` I use `github-pages` (repo [vifreefly.github.io](https://github.com/vifreefly/vifreefly.github.io)).

When I pushing a new commit (for example added new post under `_posts/` directory) to remote `blog` origin, I want first to automatically build website (`_site/` folder which stores compiled build by default) and push this build to `vfreefly.github.io`.

It's easy to implement using `pre-push` git hook:

```bash
#!/bin/bash
# copy this to `.git/hooks/pre-push` hook file and make it executable: `$ chmod +x pre-push`

echo "> Hook started"

# Build a website to a standard _site directory
bundle exec jekyll build

# cd to the build folder
cd _site

# Init a new git repo inside `_site/` if it doesn't exists
if [ ! -d ".git" ]; then
  git init
fi

if [[ ! $(git remote) ]]; then
  # Add your github-pages repo (example https://github.com/vifreefly/vifreefly.github.io.git)
  # as origin for `_site` if it's not added yet:
  git remote add origin https://github.com/vifreefly/vifreefly.github.io.git
  # and push build to the github-pages repo with --force
  git add . && git commit -m "Build" && git push -u -f origin master
else
  # Push build to the github-pages repo with --force
  git add . && git commit -m "Build" && git push -f origin master
fi

echo "< Hook finished"
```

With this hook, when I'm doing `$ git push origin master` at Jekyll `blog` repository, a **new build of a website pushes to Github Pages as well.**

> Also, you can use `pre-push` hook to push your blog to [AWS S3](https://medium.freecodecamp.org/how-to-host-a-website-on-s3-without-getting-lost-in-the-sea-e2b82aa6cd38) instead of github-pages for example.
