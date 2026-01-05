---
title: "VPN on Linux Ubuntu Desktop: user-friendly way"
description: '"List of VPN providers who have a Linux client + easy guide how to setup VPN on Ubuntu Desktop without opening terminal window"'
publishDate: "13 Nov 2018"
tags: ["ubuntu-desktop", "vpn", "linux"]
---

What is better: VPN provider or own private VPN, based on VPS server? Even if it's not a problem for you to manually setup the server (buy VPS and install/configure OpenVPN there), almost every VPN provider has **multiple IP locations feature**. In one click you can switch your location from USA/New York to Europe/Amsterdam and so on. In case of your own VPN, IP is always the same.

The sad thing is that many of VPN providers don't have a client for Linux. Here are who does:

* Nord VPN - [CLI](https://nordvpn.com/download/linux/), [OpenVPN](https://nordvpn.com/tutorials/linux/openvpn/)
* Tunnel Bear - [OpenVPN](https://www.tunnelbear.com/blog/linux_support/) support
* [ExpressVPN](https://www.expressvpn.com/vpn-software/vpn-linux) - [CLI](https://www.expressvpn.com/support/vpn-setup/app-for-linux/)
* Windscribe - [CLI](https://windscribe.com/guides/linux), [OpenVPN](https://windscribe.com/getconfig/openvpn)
* TorGuard - [Client and OpenVPN](https://torguard.net/downloads.php)
* Know something else? Please tell in the comments below.

Right after [easy registration](https://www.tunnelbear.com/account#/signup) (you have to provide only account email and password, credit card in not required) Tunnel Bear gives you 512 mb for free.

Let's use it and see **how to setup VPN on Ubuntu Desktop** (18.04-18.10) in a few, user-friendly steps: <!--more-->

**1)** Download Tunnel Bear configuration files from here <https://s3.amazonaws.com/tunnelbear/linux/openvpn.zip>

**2)** Unzip `openvpn.zip` archive: Right click > `Extract Here`

**3)** Go to `Settings` > `Network` > `VPN +`, and select `Import from file...`

![](https://i.imgur.com/nnsmYvW.png)

**4)** Go to folder with configuration files and select one of them on your choice:

![](https://i.imgur.com/eXzj3br.png)

**5)** Fill in your Tunnel Bear credentials to `User name` (account email) and `Password` (account password) fields and click `Add`

**6)** Now you can connect to a VPN from topbar menu:

![](https://i.imgur.com/NlzArtG.png)

If all is fine, you will see VPN icon:

<img src="https://i.imgur.com/zagGor9.png" alt="drawing" style="width:154px;"/>


All done! You can add multiple VPN locations and switch between them from topbar or Network settings:

![](https://i.imgur.com/w2PHb9j.png)

> BTW, you can check your location here: <https://bearsmyip.com/>
