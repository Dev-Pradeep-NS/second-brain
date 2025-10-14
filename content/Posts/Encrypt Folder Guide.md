---
title: Encrypt Folder Guide
date: 2025-10-14
draft: false
tags:
  - encrypt
  - wsl
  - tech
---
# 🔒 Folder Encryption with GPG (Opaque Method)
This method ensures **complete privacy** — nobody can peek into the folder structure or filenames without decrypting it fully.
## 🧩 Overview
Unlike `gpgtar`, which allows listing files after decryption in memory, this approach hides **all metadata** and **filenames**.

You’ll first compress your folder into a `.tar.gz` archive and then encrypt it using **GPG symmetric encryption**.

## 🪜 Steps
### Create a Tarball
```bash
tar -czf secure.tar.gz myfolder
```
- `tar` bundles and compresses your folder.
- Replace `myfolder` with the folder you want to encrypt.
- This creates `secure.tar.gz`.

### Encrypt the Tarball
```bash
gpg -c secure.tar.gz
```

- `-c` → symmetric encryption (password-based).
- You’ll be prompted to enter a passphrase (keep it safe).
- This creates a new encrypted file: `secure.tar.gz.gpg`.

### Clean Up (Optional)
You can delete the original unencrypted files after confirming encryption:
```bash
rm secure.tar.gz
rm -rf myfolder
```

### Decrypt Later
To decrypt and extract the folder:

```bash
gpg secure.tar.gz.gpg
tar -xzf secure.tar.gz
```



## ✅ Key Benefits

  

- **100% Opaque** — No filenames or structure visible until decrypted.

- **Portable** — The `.gpg` file can be safely stored or moved (e.g., USB drive, cloud).

- **Password Protected** — Only accessible with your passphrase.

  

---

  

## ⚠️ Note

  

- If you lose the password, **the data cannot be recovered**.

- Always test your encryption–decryption workflow once before deleting originals.

  

---