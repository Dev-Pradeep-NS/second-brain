---
title: Docker Installation
date: 2026-02-10
draft: false
tags:
  - docker
  - Setup
  - aws
  - ubuntu
---
**Prerequisites:**

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
```

  

**Add Docker GPG key:**

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

  

**Add Docker repository:**

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

  

**Install Docker:**

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl status docker
```

  

**Run Docker without sudo (Optional):**

```bash
sudo usermod -aG docker ${USER}
newgrp docker
docker ps
```

  

⚠️ **Warning:** Users in the docker group have root-level privileges. Acceptable for staging, not recommended for shared production servers.