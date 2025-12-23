---
title: "First thing to do after creating a new VPS server: setup deploy user and enable SSH-key authentication only"
description: "Essential security steps for new VPS servers: creating a deploy user, configuring SSH key authentication, and disabling password login to protect against brute force attacks."
publishDate: "22 Feb 2019"
tags: ["ubuntu", "linux", "digitalocean", "deploy", "devops"]
---

**0)** If after creating a VPS server you received a root user password, it's recommended to change it. To do it, login to the server as root and type `$ passwd` command. Save a new root password somewhere so you will not forget it.


**1)** Create on the remote server a `deploy` user:

```bash
# on the server, as a root user

$ adduser deploy
$ adduser deploy sudo
```

**2)** Make sure that you can login to the server as a `deploy` user without password prompt: <!--more-->

> It assumes that you have ssh keypair already (`~/.ssh/id_rsa` and `~/.ssh/id_rsa.pub`) on your desktop.

```bash
# on desktop:

$ ssh-add
$ ssh-copy-id -i ~/.ssh/id_rsa.pub deploy@deploy_server_ip
```

Now try to login to the server as deploy user:

```bash
# on desktop:

$ ssh deploy@deploy_server_ip
```

> If it didn't work, and you get message like `Permission denied (publickey)`, it seems like password authentication disabled by default on your server (which is a good thing actually). Login to the server as a `root` again, then login to `deploy` user (`$ su - deploy`) and add your .pub key to the deploy's `~/.ssh/authorized_keys` file:

> Where `your_public_key_string_value` is a content of `~/.ssh/id_rsa.pub` file on your desktop machine.

```bash
# on the server:

$ mkdir -p ~/.ssh && chmod 700 ~/.ssh
$ echo your_public_key_string_value >> ~/.ssh/authorized_keys && chmod 644 ~/.ssh/authorized_keys
```

If all went fine, you should be able to login to the server without entering a password: `$ ssh deploy@deploy_server_ip`


## Also you can:

### disable password login authentication

> Some VPS providers don't have an option to allow provide a custom public SSH key for the root user's authentication while creating a new VPS server. In this case, you'll get automatically generated password (for root user) after VPS will be created, which then can be used to login to the server. But, using password authentication isn't a good practice and can leave security vulnerabilities, such as brute force attack. It's better to disable password auth and use only SSH key authentication.

**1)** Copy your public SSH key to the server's root user using `ssh-copy-id` tool:

```bash
$ ssh-copy-id root@deploy_server_ip
```

Example:

```
$ ssh-copy-id root@5.180.150.210
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/bob/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
root@5.180.150.210's password:

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'root@5.180.150.210'"
and check to make sure that only the key(s) you wanted were added.
```

If all went fine, you'll be able to login to the server without a password prompt. Do it and:

**2)** On the server (as a root user), open `/etc/ssh/sshd_config` file (you can use `nano` editor),

> This is an important step, before process it MAKE SURE THAT you can sucessfully login to the server using SSH key, (not password). Otherwise you can lose access to your server.

and navigate to `PasswordAuthentication` line. Make sure that it's not comment-out (not starts with #), and set value to `no`:

```
PasswordAuthentication no
```

Then save the file.

**3)** Restart `sshd` to apply new settings: `$ service ssh restart`. All done!

### set UTC timezone on the server

> It's always preferable to have universal UTC timezone on the server, not the local one. To set UTC timezone run:

```bash
$ sudo timedatectl set-timezone UTC
```
