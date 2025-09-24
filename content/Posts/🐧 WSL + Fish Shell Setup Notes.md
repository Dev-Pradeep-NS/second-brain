---
title: 🐧 WSL + Fish Shell Setup Notes
date: 2025-09-24
draft: false
tags:
  - WSL
  - Shell
---
### Manage WSL Distribution

```bash
wsl -l -v                       # List all installed distros with version
wsl --unregister Ubuntu         # Remove old Ubuntu instance (⚠️ data loss)
wsl --install -d Ubuntu-24.04   # Install fresh Ubuntu
wsl -s Ubuntu-24.04             # Set Ubuntu as default distro
```

### Check Default Shell

```bash
echo $SHELL                     # Show current shell
cat /etc/shells                 # List available shells
```

### Update & Upgrade Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### Install Fish Shell + Useful Tools

```bash
sudo apt install fish -y
sudo apt install w3m -y         # Terminal web browser (for fish_config preview)
```

### Register Fish in Available Shells

```bash
cat /etc/shells                 # Verify fish is listed (usually /usr/bin/fish)
```

### Switch to Fish

```bash
fish                            # Start fish session
chsh -s /usr/bin/fish           # Set fish as default login shell
```

> ⚠️ In WSL, `chsh` sometimes doesn’t persist. If it doesn’t stick:
> 
> - Create/edit `~/.wslconfig` (Windows side) or use a `.profile` hack to auto-start fish.
>     

### Verify Installed Packages Count

```bash
grep -i "installed" /var/log/dpkg.log | wc -l
```

### Configure Fish

```bash
fish_config
```

- Opens a web UI (served locally).
    
- Requires `w3m` or browser to preview themes.
    
- Configure prompt, colors, completions, etc.
    

### Install & Configure Zoxide (Optional but Recommended)

```bash
curl -sSfL https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | sh
```

- Add to the end of your Fish config (`~/.config/fish/config.fish`):
    

```fish
zoxide init fish | source
```

### Install FZF (Optional for Zoxide Completions)

```bash
sudo apt install fzf
```

- FZF provides fuzzy search for directory navigation and works with Zoxide for interactive selection.
    
- Ensure the above `zoxide init fish | source` is in your config for seamless integration.
    

---

## ✅ Next Steps / Tips

- Install **Fisher** (plugin manager for fish):
    

```fish
curl -sL https://git.io/fisher | source && fisher install jorgebucaran/fisher
```

- Popular plugins: `jorgebucaran/nvm.fish`, `ilancosman/tide` (prompt), `patrickf1/fzf.fish`.
    
- Set aliases/functions in `~/.config/fish/config.fish`.