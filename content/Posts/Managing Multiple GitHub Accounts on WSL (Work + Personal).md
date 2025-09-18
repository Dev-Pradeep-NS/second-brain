---
title: Managing Multiple GitHub Accounts on WSL (Work + Personal)
date: 2025-09-18
draft: false
tags:
  - Git
  - SSH
---
When you work on both **personal** and **work** projects, it’s common to have separate GitHub accounts.  

The challenge? Git often uses the wrong identity when committing, and SSH keys get mixed up.

  

In this post, I’ll walk you through a clean setup for **multiple GitHub accounts on WSL (Windows Subsystem for Linux)** using SSH and Git’s conditional config.

  

## Generate SSH Keys for Each Account

  

Inside WSL, generate one key per GitHub account:

  

```bash
# Personal account
ssh-keygen -t ed25519 -C "personal@email.com" -f ~/.ssh/id_personal

# Work account
ssh-keygen -t ed25519 -C "work@email.com" -f ~/.ssh/id_work
```

  

Add each public key (`~/.ssh/id_*.pub`) to the correct GitHub account under  

**GitHub → Settings → SSH and GPG keys**.

  

---

  

## Configure `~/.ssh/config`

  

Tell SSH which key to use for each account:

  

```ssh-config
# GitHub Personal
Host github.com-Personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_personal

# GitHub Work
Host github.com-Work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_work
```

  

---

  

## Clone Repos Using Aliases

  

When cloning, use your custom host alias so the right key is picked:

  

```bash
# Personal repo
git clone git@github.com-Personal:username/repo.git

# Work repo
git clone git@github.com-Work:org/repo.git
```

  

If you already cloned a repo with `git@github.com:...`, just fix the remote:

  

```bash
git remote set-url origin git@github.com-Work:org/repo.git
```

  

---

  

## Configure Git Identities with Conditional Config

  

SSH decides **which account connects** to GitHub.  

Now let’s make Git commit with the correct **name + email** automatically.

  

### Create per-account configs

  

`~/.gitconfig-personal`

  

```ini
[user]
    name = Personal Name
    email = personal@email.com
```

  

`~/.gitconfig-work`

  

```ini
[user]
    name = Work Name
    email = work@email.com
```

  

### Update main `~/.gitconfig`

  

```ini
# Default (personal)
[user]
    name = Personal Name
    email = personal@email.com
    
# Use work identity in ~/work/
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work

# Use personal identity in ~/personal/
[includeIf "gitdir:~/personal/"]
    path = ~/.gitconfig-personal
```

  

---

  

## Organize Your Projects

  

Make folders that match your config:

  

```bash
mkdir -p ~/work ~/personal
```

  

- Work repos → `~/work/`  

- Personal repos → `~/personal/`  

  

Now Git automatically picks the correct identity depending on the folder.

  

---

  

## Verify

  

Go inside a repo and check:

  

```bash
git config user.name
git config user.email
```

  

Check SSH identity:

  

```bash
ssh -T git@github.com-Work
ssh -T git@github.com-Personal
```

  

Both should authenticate with the right GitHub account.

  

---

  

## Done!

  

Now you can work seamlessly across multiple GitHub accounts in WSL:

  

- Git uses the right **commit identity** (via conditional config).  

- SSH uses the right **account key** (via `~/.ssh/config`).  

- No more accidentally committing work code with your personal email!  

  

---

  

👉 Pro tip: if your repos aren’t under `~/work/` or `~/personal/`, just update the `gitdir:` paths in `~/.gitconfig` to match your actual directory layout.