---
title: Create a Separate Linux User with Sudo Access (Ubuntu EC2)
date: 2026-02-10
draft: false
tags:
  - aws
  - Setup
---
# Linux User Management & Security Guide (Ubuntu/EC2)

Managing individual accounts is the "Gold Standard" for server administration. This guide covers the lifecycle of a user account from creation to secure offboarding.

## 1. Prerequisites

Before starting, ensure you have:

- An active **Ubuntu EC2 instance**.
    
- SSH access via the default `ubuntu` user or any user with `sudo` privileges.
    
- The **SSH Public Key** of the person you are adding (e.g., `id_rsa.pub`).
    

---

## 2. Onboarding: Adding a New User

### Step 1: Create the Account

Running the following command initiates a script that creates a home directory and sets up the user environment.

```
sudo adduser friend
```

> **AI Tip:** You will be prompted for a password. Even though we use SSH keys for login, the user needs this password to authenticate `sudo` requests.

### Step 2: Elevate Privileges

If this user needs to perform administrative tasks (installing software, restarting services), add them to the `sudo` group:

```
sudo usermod -aG sudo friend
```

### Step 3: Set Up SSH Key Authentication

To allow the user to log in without a password, you must manually inject their public key into their home directory.

```
# 1. Create the .ssh directory and set restricted permissions
sudo mkdir -p /home/friend/.ssh
sudo chmod 700 /home/friend/.ssh

# 2. Add their public key to the authorized_keys file
echo "ssh-rsa AAA...your_friend_key_here..." | sudo tee /home/friend/.ssh/authorized_keys > /dev/null

# 3. Finalize permissions and ownership
sudo chmod 600 /home/friend/.ssh/authorized_keys
sudo chown -R friend:friend /home/friend/.ssh
```

---

## 3. Why Permissions Matter

Linux follows the **Principle of Least Privilege**. If your `.ssh` folder is readable by others, the SSH daemon (`sshd`) will consider it insecure and refuse the connection.

|**Path**|**Recommended**|**Permission Type**|**Reason**|
|---|---|---|---|
|`/home/friend/.ssh`|`700`|`drwx------`|Prevents other users from seeing which keys are trusted.|
|`authorized_keys`|`600`|`-rw-------`|Prevents tampering with the "VIP list" of allowed keys.|

---

## 4. Offboarding: Revoking Access

Offboarding is rarely "one size fits all." Use the level that matches your specific situation.

### Level 1: The Temporary Lock

_Best for: Users on leave or temporary suspension._

```
sudo usermod -L friend
```

- **Effect:** Locks the password.
    
- **To Reverse:** `sudo usermod -U friend`
    

### Level 2: Revoking SSH Access (Recommended)

_Best for: Former collaborators who no longer need access, but whose data you want to keep._

```
# Option A: Manual removal
sudo nano /home/friend/.ssh/authorized_keys # Delete the specific key line

# Option B: Total wipe (If they had multiple keys)
sudo truncate -s 0 /home/friend/.ssh/authorized_keys
```

### Level 3: Permanent Deletion

_Best for: Cleanly removing a user and freeing up disk space._

```
sudo deluser --remove-home friend
```

- **Warning:** This is destructive. It deletes the `/home/friend` folder and all files owned by that user.
    

### Level 4: The "Nuclear" Option (Terminate Active Sessions)

Updating permissions only stops **new** logins. If a user is currently logged in, they remain in the system. To force an immediate logout:

```
sudo killall -u friend
```

---

## 5. Security Summary

| **Practice**        | **Verdict**     | **Why?**                                                         |
| ------------------- | --------------- | ---------------------------------------------------------------- |
| **Shared Accounts** | ❌ **High Risk** | No accountability; difficult to rotate keys when someone leaves. |
| **Password Auth**   | ❌ **High Risk** | Susceptible to "Brute Force" dictionary attacks.                 |
| **SSH Keys**        | ✅ **Safe**      | Cryptographically strong; nearly impossible to guess.            |
| **Individual Sudo** | ✅ **Safe**      | Logs in `/var/log/auth.log` show exactly who did what.           |