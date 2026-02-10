---
title: Transferring Files to AWS EC2
date: 2026-02-10
draft: false
tags:
  - Shell
  - SSH
  - aws
---
# Transferring Files to AWS EC2

## Overview
This section explains how to transfer files from a local machine to an AWS EC2 instance using SSH and SCP.

---

## Prerequisites

### EC2 Access
Make sure you have:
- EC2 public IP address or public DNS
- SSH key pair file (`.pem`)
- Correct username for the AMI:
  - `ubuntu` (Ubuntu)
  - `ec2-user` (Amazon Linux)
  - `admin` (custom AMIs)

---

### SSH Key Permissions
Set proper permissions for the key file:
```bash
chmod 400 ~/.ssh/your-key.pem
```

### Local Requirements

- File(s) to transfer
    
- SSH and SCP installed
    
- Port **22** allowed in EC2 Security Group
    

---

## Transfer Files Using SCP

### Basic Syntax

`scp -i /path/to/key.pem /local/path/to/file username@ec2-ip:/remote/destination/path/`

### Example

`scp -i ~/.ssh/my-key.pem ~/Documents/data.xlsx ubuntu@54.123.45.67:/home/ubuntu/`

---

## Notes

- For filenames with spaces:
    
    - Use backslashes:
        
        `file\ name.xlsx`
        
    - Or use quotes:
        
        `"file name.xlsx"`
        
- Ensure the destination directory exists on the EC2 instance
    
- Large files may take time depending on network speed
    

---

## Verify File Transfer

### Login and Check

`ssh -i ~/.ssh/my-key.pem ubuntu@54.123.45.67 ls -lh /home/ubuntu/`

### Direct Verification

`ssh -i ~/.ssh/my-key.pem ubuntu@54.123.45.67 "ls -lh /home/ubuntu/data.xlsx"`

---

## Common Issues

- **Permission denied**: Check key permissions and username
    
- **Connection timeout**: Verify Security Group allows SSH (port 22)
    
- **File not found**: Confirm source and destination paths