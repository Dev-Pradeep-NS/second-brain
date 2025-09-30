---
title: Vite + Vue + TailwindCSS Setup (Using pnpm)
date: 2025-09-30
draft: false
tags:
  - Vue
  - Vite
  - Setup
  - tech
---
## Create a Vite + Vue Project

You can directly specify the project name and template:

```bash
pnpm create vite my-vue-app --template vue
cd my-vue-app
```

Supported templates include:

```
vanilla, vanilla-ts, vue, vue-ts, react, react-ts, react-swc, react-swc-ts, 
preact, preact-ts, lit, lit-ts, svelte, svelte-ts, solid, solid-ts, qwik, qwik-ts
```

## Install TailwindCSS

Install TailwindCSS and the Vite plugin:

```bash
pnpm install tailwindcss @tailwindcss/vite
```

## Configure Vite Plugin

Edit `vite.config.ts` to add TailwindCSS:

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

## Import Tailwind CSS

In your main CSS file (`src/style.css`):

```css
@import "tailwindcss";
```

## Start the Dev Server

```bash
pnpm run dev
```

## Use Tailwind in HTML / Vue Templates

```html
<template>
  <h1 class="text-3xl font-bold underline">
    Hello World!
  </h1>
</template>
```