---
title: React native expo setup(with Nativewind)
date: 2026-02-16
draft: false
tags:
  - Setup
  - react-native
  - development
---
# React native Expo setup(with Nativewind)

Expo app with NativeWind (Tailwind CSS for React Native).

## 1. Create project and install dependencies

```bash
pnpx create-expo-app@latest
cd expense-tracker
cursor .
pnpm exec expo start --clear
pnpm run reset-project
# Press "no" when prompted
```

```bash
pnpx expo install nativewind react-native-reanimated@~3.17.4 react-native-safe-area-context@5.4.0
pnpx expo install --dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11
```

## 2. Setup Tailwind CSS

Run `npx tailwindcss init` to create a `tailwind.config.js` file.

Add the paths to all of your component files in `tailwind.config.js`:

**tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Create a CSS file and add the Tailwind directives.

**app/global.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3. Add the Babel preset

**babel.config.js**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

## 4. Metro config

Create a `metro.config.js` file in the project root if you don't have one, then add:

**metro.config.js**

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./app/global.css" });
```

## 5. Import CSS in layout

In `app/_layout.tsx`, add:

```ts
import "./global.css";
```

## 6. App config (web)

In `app.json`, add `"bundler": "metro"` inside the `web` section:

```json
"web": {
  "bundler": "metro",
  ...
}
```

## 7. TypeScript (optional)

Create `nativewind-env.d.ts` and add:

```ts
/// <reference types="nativewind/types" />
```

## Troubleshooting

### "Unable to resolve react-native-css-interop/jsx-runtime"

With pnpm, add `react-native-css-interop` as a direct dependency (e.g. version `0.2.1` in `package.json`), then:

```bash
pnpm install
pnpm exec expo start --clear
```
