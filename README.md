# ePanda Commerce

A modern, responsive e‑commerce UI prototype built with TypeScript, Tailwind CSS and DaisyUI. Designed for rapid iteration, accessibility and best practices — ideal as a polished front-end starter for shopping experiences or for showcasing to clients.

## Badges

- Status: Prototype
- Stack: TypeScript · Tailwind CSS · DaisyUI · Vite

---

## Table of contents

- [Overview](#overview)
- [Highlights](#highlights)
- [Architecture & Key Files](#architecture--key-files)
- [Core Types & Classes](#core-types--classes)
- [Getting started](#getting-started)
- [Development workflow](#development-workflow)
- [Build & Deploy](#build--deploy)
- [Design & UX notes](#design--ux-notes)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## Overview

A production-oriented front-end scaffold demonstrating:

- Clean component structure using semantic HTML and DaisyUI components.
- Type-safe interactivity powered by TypeScript.
- Fast local development with Vite and Tailwind CSS for utility-first styling.
- Persistent client-side cart state and unobtrusive UI feedback.

## Highlights

- Polished UI: responsive hero carousel, category cards, product grids and an interactive cart dropdown.
- Client-side persistence: cart persists via localStorage.
- Theme toggle supporting DaisyUI dark/light [data-theme].
- Lightweight and easily extendable — suitable for integration with any backend or headless commerce platform.

---

## Architecture & Key Files

- Entry HTML: [src/index.html](src/index.html)
- Main frontend logic: [src/js/main.ts](src/js/main.ts)
- Styles: [src/css/style.css](src/css/style.css)
- Build / dev config:
  - [vite.config.js](vite.config.js)
  - [tailwind.config.js](tailwind.config.js)
  - [postcss.config.js](postcss.config.js)
  - [tsconfig.json](tsconfig.json)
  - [package.json](package.json)

All assets live under `src/images/` following the repository structure.

---

### Core types & classes

- The project defines a product model as an interface: [`Product`](src/js/main.ts)
- Cart behavior is encapsulated in the [`ShoppingCart`](src/js/main.ts) class which manages persistence, UI updates and notifications.

Refer to:

- [`Product`](src/js/main.ts)
- [`ShoppingCart`](src/js/main.ts)
- Source: [src/js/main.ts](src/js/main.ts)

---

### Getting started

### Requirements

- Node.js 16+ (or compatible with devDependencies)
- npm or yarn

### Quick start

1. Install dependencies
   npm install
2. Run local dev server
   npm run dev
   Open http://localhost:3000 (Vite will print the exact URL).
3. Build for production
   npm run build
4. Preview production build
   npm run preview

### Scripts (from [package.json](package.json)):

- dev — start Vite dev server
- build — type-check then build with Vite
- preview — preview built site

---

### Development workflow & notes

- TypeScript is used without emitting build artifacts during development. Type checking is enforced via `tsc` in the build script.
- Tailwind + DaisyUI provide utility classes and theming. See [tailwind.config.js](tailwind.config.js) for custom colors and fonts.
- PostCSS configuration is in [postcss.config.js](postcss.config.js).
- Vite root is set to `src` in [vite.config.js](vite.config.js), output is `dist`.

Extending the project

- Replace static product cards in [src/index.html](src/index.html) with data-driven rendering by fetching products and mapping to templates.
- Swap localStorage persistence in [`ShoppingCart`](src/js/main.ts) for API-backed cart storage to integrate with a backend.
- Add unit tests and CI for type safety and regression protection.

---

### Design & UX notes

- Accessibility: semantic elements, aria-friendly DaisyUI components and keyboard-accessible dropdowns.
- Responsive design: fluid grids and media queries in [src/css/style.css](src/css/style.css).
- Visual identity: custom CSS variables for brand colors and subtle hover/transition effects.

---

### Contributing

1. Fork the repository
2. Create a feature branch
3. Open a pull request with a clear description and screenshots where applicable
   Please follow consistent commit messages and keep changes scoped.

---

### License & Contact

- License: MIT (see LICENSE file if added)
- Repo: https://github.com/Kawser420/ePanda
- For questions or commercial usage, open an issue or reach out via the repo.

---

#### Acknowledgements

- Built with Vite, Tailwind CSS and DaisyUI for rapid, accessible UI development.
