---
title: DNS & Subdomain Setup
date: 2026-02-10
draft: false
tags:
  - aws
  - Setup
---
**Domain Provider:** GoDaddy / Namecheap / Route 53 / Cloudflare

**Add A Record:**

|Field|Value|
|---|---|
|Type|A|
|Name|kredl|
|Value|`<EC2_PUBLIC_IP or Elastic IP>`|
|TTL|Auto / 300|

**Result:** `kredl.sustivon.com` → EC2 IP