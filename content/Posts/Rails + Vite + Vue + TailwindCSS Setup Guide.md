---
title: Rails + Vite + Vue + TailwindCSS Setup Guide
date: 2025-10-14
draft: false
tags:
  - development
  - Setup
  - Vite
  - Vue
---
# Rails + Vite + Vue + TailwindCSS Setup Guide

## Create a New Rails Project
```bash
rails new sixshot-admin --skip-javascript
```

## Add Vite Ruby Gem
In your `Gemfile`, add:
```ruby
gem "vite_rails"
```
Then install the gems:
```bash
bundle install
```
Install Vite:
```bash
bundle exec vite install
```

## Setup Vue Project
1. Inside your Rails project, create a frontend folder if not exist:
    
```bash
mkdir -p app/frontend
```
2. Create a Vite + Vue project inside the frontend folder:
    
```bash
pnpm create vite client --template vue
```
3. Remove the default `node_modules` in the client folder:
    
```bash
rm -rf client/node_modules
```

If you want you can follow [[Vite + Vue + TailwindCSS Setup (Using pnpm)]]

## Install TailwindCSS
From the Rails root folder:
```bash
pnpm add tailwindcss @tailwindcss/vite
```

Update the `package.json` in the root folder with the following:

```json
{
  "private": true,
  "type": "module",
  "devDependencies": {
    "vite": "^5.4.20",
    "vite-plugin-ruby": "^5.1.1"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-vue": "^6.0.1",
    "tailwindcss": "^4.1.14",
    "vite": "^5.0.0",
    "vite-plugin-rails": "^0.5.0",
    "vue": "^3.5.22"
  }
}
```

and do pnpm install from the root folder

## Configure Vite + TailwindCSS
Edit `vite.config.ts` in your root folder:
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
```

## Setup TailwindCSS
In your main CSS file (e.g., `src/style.css`):
```css
@import "tailwindcss";
```

## Clean Up Client Folder
Delete unnecessary files in `client`:
```bash
rm client/main.js package.json pnpm-lock.yaml
```

## Update Rails Application JS
In `app/frontend/entrypoints/application.js`:
```js
import { createApp } from "vue";
import App from "../client/src/App.vue";
import "../client/src/style.css";

const app = createApp(App);
app.mount("#app");
```

## Create Root View
In `app/views/home/index.html.erb`:
```erb
<div id="app"></div>
```

## Update Application Controller
In `app/controllers/application_controller.rb`:
```ruby
class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  def index
    render "home/index"
  end
end
```

## Configure Routes
In `config/routes.rb`:
```ruby
Rails.application.routes.draw do
  root "application#index"
end
```

## Setup Complete
- Rails serves Vue via Vite.
    
- TailwindCSS is integrated.
    
- The root route points to a Vue-powered home page.