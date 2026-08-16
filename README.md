# Hydro-Habit Web

Official landing page for **Hydro-Habit**, a smart hydration coaster experience focused on BYOV (Bring Your Own Vessel), daily habit tracking, and Family Care notifications.

## Overview

This repository contains a static, single-page product website built with plain HTML, CSS, and JavaScript.  
It highlights the Hydro-Habit concept through animated storytelling sections, product visuals, and conversion-focused CTAs.

## Features

- Premium hero section with animated water-particle canvas
- BYOV-focused product feature cards
- Family Care storytelling and mock notification flow
- Daily hydration goal and reminder visuals
- 28-day dashboard heatmap and animated counters
- Pricing/value comparison and final call-to-action
- Floating social links and smooth in-page navigation

## Tech Stack

- **HTML5** (`index.html`)
- **CSS3** (`styles.css`)
- **Vanilla JavaScript** (`main.js`)
- Static assets in `assets/`
- Deployment via **Azure Static Web Apps** GitHub Actions workflow

## Project Structure

```text
hydro-habit-web/
├── index.html
├── styles.css
├── main.js
├── assets/
│   ├── hero.png
│   ├── product.png
│   ├── elderly.png
│   ├── dashboard.png
│   └── pricing_graphic.png
└── .github/workflows/
    └── azure-static-web-apps-red-rock-07b706200.yml
```

## Getting Started

Because this is a static site, no package installation is required.

1. Clone the repository.
2. Open `index.html` directly in your browser  
   **or**
3. Serve the project with a local static server, for example:
   - VS Code Live Server
   - `python -m http.server`

## Deployment

Deployment is configured with GitHub Actions for Azure Static Web Apps:

- Workflow file: `.github/workflows/azure-static-web-apps-red-rock-07b706200.yml`
- Triggered on pushes to `main`
- Also runs for pull request validation

## License

This project is licensed under the [MIT License](./LICENSE).