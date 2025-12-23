---
title: "Create free HTTPS/SOCKS5 proxy servers using AWS Free Tier EC2 instances automatically with Terraform"
description: "Automate the creation of free proxy servers using AWS Free Tier EC2 instances and Terraform for on-demand proxy infrastructure."
publishDate: "11 Jun 2018"
tags: ["aws", "linux", "terraform", "automation", "devops", "proxy"]
---

For scraping purposes, I need good quality proxies every day for 1–2 hours, when my web crawlers are running. I don’t need proxies 24/hours per day.

So it makes sense to use AWS EC2 [t2.nano/t2.micro](https://aws.amazon.com/ec2/instance-types/) instances for proxy servers and create/destroy them on demand within HTTP API.

<!--more-->

**Benefits of this approach:**
1. If you are not reached [AWS Free Tier](https://aws.amazon.com/free/) yet, that means you have [750 hours](https://aws.amazon.com/free/faqs/?ft=n) and [15 GB of outbound traffic](https://aws.amazon.com/free/faqs/?ft=n) per month for free, for [up to 20 EC2 instances](https://aws.amazon.com/ec2/faqs/#How_many_instances_can_I_run_in_Amazon_EC2) (VPS servers) running at the same time. For example, you’ll spend only 600 hours/month, if you need 20 proxies per day for a one hour (20 x 1 x 30 = 600).
2. When you’ll exceed 15 GB/month free tier limit of outbound traffic, AWS will charge you only [$0.090 per additional GB](https://aws.amazon.com/ec2/pricing/on-demand/). I think it’s pretty cheap.
3. Each new instance (or instance which was stopped and started again) [will get a random IPv4 address](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-instance-addressing.html#concepts-public-addresses) from pool, so each time we’ll have fresh proxy IP’s.

Even if free tier is not available for you, price for [EC2 t2.nano](https://aws.amazon.com/ec2/pricing/on-demand/) instance is only _$0.0058 per Hour_, and price for 1 GB outbound traffic is _$0.090._

**To automate the process of creation EC2 instances** and installation proxy server software, I used next tools:
* [Terraform](https://www.terraform.io/) to automatically **create/install software/destroy** EC2 instances
* [Goproxy](https://github.com/snail007/goproxy) for a proxy server. Simple but powerful: one-line command installation, zero configuration. HTTPS, SOCKS5 proxy with optional authorization out of box
* [Ruby Sinatra gem](http://sinatrarb.com/) for HTTP API to manage proxy instances (optional)
* Ubuntu 16.04 server
* Systemd to convert goproxy process to the system daemon service


**To give a try, check the project repo** on github here: <https://github.com/vifreefly/ec2_proxies>
