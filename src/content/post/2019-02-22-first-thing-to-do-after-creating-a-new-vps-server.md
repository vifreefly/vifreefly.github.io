---
title: "First thing to do after creating a new VPS server: setup deploy user and enable SSH-key authentication only"
description: "Essential security steps for new VPS servers: creating a deploy user, configuring SSH key authentication, and disabling password login to protect against brute force attacks."
publishDate: "22 Feb 2019"
tags: ["ubuntu", "linux", "digitalocean", "deploy", "devops"]
---

If you received a root user password after creating a VPS server, it's recommended to change it. To do so, log in to the server as root and type the `$ passwd` command. Save the new root password somewhere safe so you won't forget it.


## Create on the remote server a `deploy` user

```bash
# on the server, as a root user

$ adduser deploy
$ adduser deploy sudo
```

## Make sure that you can log in to the server as a `deploy` user without a password prompt

This assumes that you already have an SSH keypair (`~/.ssh/id_rsa` and `~/.ssh/id_rsa.pub`) on your desktop.

```bash
# on desktop:
$ ssh-add
$ ssh-copy-id -i ~/.ssh/id_rsa.pub deploy@deploy_server_ip
```

Now try to log in to the server as the deploy user:

```bash
# on desktop:
$ ssh deploy@deploy_server_ip
```

If it didn't work and you get a message like `Permission denied (publickey)`, it seems like password authentication is disabled by default on your server (which is actually a good thing). Log in to the server as `root` again, then switch to the `deploy` user (`$ su - deploy`) and add your .pub key to the deploy user's `~/.ssh/authorized_keys` file (where `your_public_key_string_value` is the content of the `~/.ssh/id_rsa.pub` file on your desktop machine).

```bash
# on the server:
$ mkdir -p ~/.ssh && chmod 700 ~/.ssh
$ echo your_public_key_string_value >> ~/.ssh/authorized_keys && chmod 644 ~/.ssh/authorized_keys
```

If all went well, you should be able to log in to the server without entering a password: `$ ssh deploy@deploy_server_ip`


## Additional steps
### Disable password login authentication

Some VPS providers don't have an option to provide a custom public SSH key for the root user's authentication while creating a new VPS server. In this case, you'll get an automatically generated password (for the root user) after the VPS is created, which can then be used to log in to the server. However, using password authentication isn't a good practice and can leave security vulnerabilities, such as brute force attacks. It's better to disable password authentication and use only SSH key authentication.

1. Copy your public SSH key to the server's root user using the `ssh-copy-id` tool:

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

If all went well, you'll be able to log in to the server without a password prompt. Do so and:

2. On the server (as the root user), open the `/etc/ssh/sshd_config` file (you can use the `nano` editor).

(this is an important step. Before proceeding, MAKE SURE THAT you can successfully log in to the server using an SSH key (not a password). Otherwise, you can lose access to your server)

Navigate to the `PasswordAuthentication` line. Make sure that it's not commented out (doesn't start with #), and set the value to `no`:

```
PasswordAuthentication no
```

Then save the file.

3. Restart `sshd` to apply the new settings: `$ service ssh restart`. All done!

### Set UTC timezone on the server

It's always preferable to have the universal UTC timezone on the server, not the local one. To set the UTC timezone, run:

```bash
$ sudo timedatectl set-timezone UTC
```
