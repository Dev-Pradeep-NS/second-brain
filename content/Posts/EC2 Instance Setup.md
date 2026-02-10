---
title: EC2 Instance Setup
date: 2026-02-10
draft: false
tags:
  - aws
  - Setup
  - ubuntu
---
### Create EC2 Instance

**Operating System:** Ubuntu 22.04 LTS

**Instance Type:**
- **Minimum:** t3.small (2 vCPU, 2 GB RAM)
- **Recommended:** t3.medium (2 vCPU, 4 GB RAM)

**Storage:** ≥ 20 GB (gp3 preferred)

**Security Group (Initial Configuration):**

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | Your IP |
| HTTP | 80 | 0.0.0.0/0 |
| HTTPS | 443 | 0.0.0.0/0 |

### 1.2 Connect to EC2 via SSH

```bash
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>
```

**Note:** AWS EC2 uses SSH key authentication. There is no sudo password by default.

### 1.3 Elastic IP (Highly Recommended)

⚠️ **Important:** EC2 public IPs change on stop/start. Use an Elastic IP to maintain a static IP address.

- Allocate Elastic IP in AWS Console
- Associate it with your EC2 instance
- Update DNS A record once (no need to update after restarts)

