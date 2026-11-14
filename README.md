# AlgoPulse — Sorting Algorithm Visualizer

A clean, responsive, and interactive sorting algorithm visualizer built with semantic HTML5, modern CSS3, and vanilla JavaScript. Designed with zero frameworks, zero dependencies, and no build step, making it instantly deployable to GitHub Pages.

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-blue?style=flat&logo=github)](https://your-username.github.io/sorting-visualizer/)
[![No Dependencies](https://img.shields.io/badge/Dependencies-Zero-emerald?style=flat)](#tech-stack)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=flat)](LICENSE)

---

## 🔗 Live Demo & Screenshot

- **Live Demo:** [https://your-username.github.io/sorting-visualizer/](https://your-username.github.io/sorting-visualizer/) *(Replace with your GitHub Pages URL)*

### Screenshot

<!-- Replace with an actual screenshot or GIF demo of AlgoPulse in action -->
![AlgoPulse Sorting Visualizer Screenshot](https://via.placeholder.com/1200x675/0a0e17/38bdf8?text=AlgoPulse+Sorting+Algorithm+Visualizer)

---

## ✨ Features

- **Five Fundamental Algorithms:**
  - **Bubble Sort:** Adjacent element comparison and upward bubbling.
  - **Selection Sort:** Unsorted minimum search and linear placement.
  - **Insertion Sort:** Backward comparison and contiguous element shifts.
  - **Merge Sort:** Divide-and-conquer recursive splitting and linear merging.
  - **Quick Sort:** Lomuto partitioning around a dynamic pivot element.

- **Dynamic Visualization:**
  - Vertical bars scaled proportionally to represent array values.
  - Dynamic value labels for small array sizes (≤ 25 elements) and tooltips on hover.
  - Celebratory cascading green wave upon sort completion.

- **Precise Color Coding:**
  - **Default:** Calm sky blue (`#38bdf8`)
  - **Comparing:** Radiant amber (`#fbbf24`)
  - **Swapping / Writing:** Vivid rose (`#f43f5e`)
  - **Sorted:** Neon emerald (`#10b981`)

- **Interactive Controls:**
  - **Algorithm Selector:** Instantly switches algorithm and loads its metadata.
  - **Array Size Slider:** Configurable from 10 to 100 elements.
  - **Animation Speed Slider:** Smooth non-linear speed scaling from slow stepping to ultra-fast execution.
  - **New Array Button:** Generates a randomized dataset.
  - **Sort Button:** Initiates the sorting animation.
  - **Stop Button:** Instantly halts running animations and unwinds recursive calls. All controls except Stop are disabled during sorting.

- **Live Metrics & Complexity Dashboard:**
  - Real-time comparison and swap/write counters.
  - Live status indicator (`Ready`, `Sorting...`, `Stopped`, `Sorted!`).
  - Algorithm complexity table showing Best, Average, Worst Time Complexity, Space Complexity, and Stability directly next to the visualizer bars.

- **Accessibility & Mobile-Ready:**
  - Full keyboard navigation with visible focus rings (`:focus-visible`).
  - Keyboard shortcuts: `Spacebar` to start/stop sorting, `N` to generate a new array.
  - Accessible `aria-label`s on all controls and `aria-live` regions for live metrics.
  - Fully responsive layout adapting seamlessly from 4K desktop screens down to smartphones.

---

## 🛠️ Tech Stack

- **HTML5:** Semantic layout with `<header>`, `<main>`, `<section>`, `<aside>`, and `<footer>`.
- **CSS3:** Custom properties (CSS variables), glassmorphism, flexbox, CSS grid, and responsive media queries.
- **JavaScript (ES6+):** Pure vanilla JavaScript using `async/await` and a promise-based `sleep()` helper with instant abort signal rejection. No build steps, bundlers, or external libraries.
- **Typography:** Google Fonts ([Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)).

---

## 🚀 How to Run Locally

Because this project requires no compiler, package manager, or build step, you can run it in seconds:

### Method 1: Direct File Opening
1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/sorting-visualizer.git
   cd sorting-visualizer
   ```
2. Double-click `index.html` or open it directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local HTTP Server (Optional)
If you prefer running through a lightweight local web server:

**Using Python 3:**
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

**Using Node.js (npx):**
```bash
npx serve .
```

---

## 📊 Algorithm Complexity Cheat Sheet

| Algorithm | Best Time | Average Time | Worst Time | Space Complexity | Stability |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Stable |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Unstable |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Stable |
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Stable |
| **Quick Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | Unstable |

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Select the `main` (or `master`) branch and folder `/ (root)`.
5. Click **Save**. Your visualizer will be live in minutes!

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
