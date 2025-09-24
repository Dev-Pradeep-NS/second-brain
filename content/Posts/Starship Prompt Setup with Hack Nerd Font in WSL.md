---
title: Starship Prompt Setup with Hack Nerd Font in WSL
date: 2025-09-24
draft: false
tags:
  - WSL
  - Starship
---
## Prerequisites

- WSL 2 installed with a Linux distribution (e.g., Ubuntu)
    
- Fish shell installed (optional but recommended)
    
- Hack Nerd Font installed on Windows (required for icons)
    
- For related setup details, see [[🐧 WSL + Fish Shell Setup Notes]]

## Install Hack Nerd Font

1. Download Hack Nerd Font from:
    
    - [Nerd Fonts](https://www.nerdfonts.com/font-downloads)
        
    - Or GitHub releases: [https://github.com/ryanoasis/nerd-fonts/releases](https://github.com/ryanoasis/nerd-fonts/releases) → Hack.zip
        
2. Extract the zip file.
    
3. Right-click the `.ttf` files → **Install for all users** (or **Install**).
    

### Set Hack Nerd Font in Terminal

#### Windows Terminal

1. Open **Settings** → **Profiles** → WSL profile.
    
2. Go to **Appearance** → **Font face**.
    
3. Select `Hack NF`.
    

#### VS Code Integrated Terminal

1. Open **Settings** (`Ctrl + ,`) → search `terminal.integrated.fontFamily`.
    
2. Set:
    

```text
Hack NF
```

## Install Starship Prompt

Run the official install script:

```bash
curl -sS https://starship.rs/install.sh | sh
```

Add Starship initialization to Fish shell config:

```fish
echo 'starship init fish | source' >> ~/.config/fish/config.fish
```

## Apply Gruvbox Rainbow Preset

Generate the preset configuration:

```bash
starship preset gruvbox-rainbow -o ~/.config/starship.toml
```

(Optional) Use a community version with extended language support:

```bash
curl -o ~/.config/starship.toml https://raw.githubusercontent.com/fang2hou/starship-gruvbox-rainbow/main/starship.toml
```

## Reload Fish Shell

```fish
source ~/.config/fish/config.fish
```

## Verify Setup

```bash
starship prompt
```

All icons should render correctly if Hack Nerd Font is applied.

## References

- [Starship Official Installation](https://starship.rs/installing/)
    
- [Gruvbox Rainbow Preset](https://starship.rs/presets/gruvbox-rainbow)
    
- [Nerd Fonts](https://www.nerdfonts.com/font-downloads)