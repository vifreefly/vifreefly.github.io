---
title: "How to create AWS restricted credentials (example for s3)"
description: "How to create AWS restricted credentials (example for s3)"
publishDate: "6 Jun 2018"
tags: ["devops", "aws", "S3"]
---

1) Go to <https://console.aws.amazon.com/iam/home?#/users> and create new user then press next

[![](https://cdn-images-1.medium.com/max/2000/1*YBWJHkmt1dKAI8PtcJsSHg.jpeg)](https://cdn-images-1.medium.com/max/2000/1*YBWJHkmt1dKAI8PtcJsSHg.jpeg)

2) Set permissions for your user by _Attach one or more existing policies directly_ and then press next

<!--more-->

[![](https://cdn-images-1.medium.com/max/2000/1*VJC8IvPGhGK8ojRvehoW_g.jpeg)](https://cdn-images-1.medium.com/max/2000/1*VJC8IvPGhGK8ojRvehoW_g.jpeg)


3) Check if everything is ok and press _create user_

4)  All done, save your _Access key ID_ and _Secret access key_

[![](https://cdn-images-1.medium.com/max/2000/1*M9FoR218z2HQcfo8bxR0IA.jpeg)](https://cdn-images-1.medium.com/max/2000/1*M9FoR218z2HQcfo8bxR0IA.jpeg)


You can see all your credentials here <https://console.aws.amazon.com/iam/home?#/users> (1 user = 1 credential)

[![](https://cdn-images-1.medium.com/max/2000/1*gH3H2OVd61WwGkuRmG8onw.jpeg)](https://cdn-images-1.medium.com/max/2000/1*gH3H2OVd61WwGkuRmG8onw.jpeg)


Now you can use this credential and it will have access only for s3 operations, all other operations will fail to process (like creating EC2 instances).

It is good practice to use different (and restricted) credentials (that means different users, because 1 user = 1 credential) for different apps so you can always control all your AWS usage per app.

**Additional reading:**
* Restrict Steps <https://www.netguru.co/blog/my-first-5-minutes-on-an-aws-account>
* Best Security Practices by amazon <https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html?icmpid=docs_iam_console>
