# 🏢 EcoCalc - Building Energy Efficiency Calculator

A modern web application for calculating building heat loss and evaluating energy efficiency. Built with Node.js and vanilla JavaScript, featuring a sleek dark green theme with optional light mode.

![EcoCalc Preview](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue) ![Language](https://img.shields.io/badge/Languages-EN%20%7C%20BG-orange)

## 🌟 Features

### Core Functionality
- **Heat Loss Calculation** - Calculate heat loss through building walls in kilowatts (kW)
- **Material Database** - Pre-loaded materials with thermal conductivity values and thickness limits
- **Normalized Efficiency Rating** - Visual indicator based on heat loss intensity (q = Q / A × ΔT), independent of area and temperature
- **Real-time Validation** - Input validation with translated warning messages
- **Calculation History** - Local storage of previous calculations

### User Experience
- **Bilingual Support** - Full English and Bulgarian language toggle (persisted in localStorage)
- **Theme Toggle** - Switch between dark green and light white themes (persisted in localStorage)
- **Responsive Design** - Two-column layout for desktop, stacked for mobile
- **PWA Ready** - Progressive Web App support for offline use

### Input Validation
| Parameter | Range | Notes |
|-----------|-------|-------|
| Internal Temperature | 10°C – 30°C | Comfort zone standards |
| External Temperature | -30°C – +50°C | Bulgarian climate extremes |
| Thickness | Material-specific max | See table below |
| Decimal Places | Max 2 digits | e.g., 15.25 or 15,25 |

### Materials & Limits

| Material | λ (W/m·K) | Max Thickness |
|----------|-----------|---------------|
| Concrete | 1.65 | 40 cm |
| Brick | 0.79 | 40 cm |
| Bitumen Insulation | 0.27 | 2 cm |
| Wood | 0.13 | 15 cm |
| Glass Wool | 0.04 | 15 cm |

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Styling**: Custom CSS with CSS variables for theming
- **Icons**: Bootstrap Icons
- **Database**: Firebase Firestore (optional cloud sync)

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kris15kirov/energy-efficiency-calculator.git
   cd energy-efficiency-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - **Local**: http://localhost:3000
   - **Network** (same WiFi): http://YOUR_LOCAL_IP:3000

## 📐 How It Works

The calculator uses the heat transfer formula:

```
Q = U × A × ΔT
```

Where:
- **Q** = Heat Loss (W)
- **U** = Thermal Transmittance (1/R, where R = thickness/λ) in W/m²K
- **A** = Surface Area (m²)
- **ΔT** = Temperature Difference (°C)

### Normalized Efficiency Scale

The efficiency indicator uses **normalized heat loss intensity**:

```
q = Q / (A × ΔT) = U
```

This value (in W/m²K) is independent of area and temperature inputs:

| q Value | Rating | Color |
|---------|--------|-------|
| ≤ 0.3 W/m²K | Good | 🟢 Green |
| 0.3 – 0.6 W/m²K | Average | 🟡🟠 Yellow/Orange |
| > 0.6 W/m²K | Poor | 🔴 Red |

> **Note**: The calculator uses a simplified one-layer heat transfer model and does not include thermal bridges or surface resistances.

## 🎨 Themes

| Theme | Description |
|-------|-------------|
| 🌙 **Dark (Default)** | Dark green background, light text |
| ☀️ **Light** | White background, dark text |

Toggle themes using the sun/moon button in the navigation bar.

## 🏛️ Project Information

Developed as part of a research initiative at the Bulgarian Academy of Sciences (BAS).

| Role | Name |
|------|------|
| **Student** | Kristiyan Kirov |
| **Mentor** | Dr. Veneta Yosifova |
| **Institute** | [IICT - Bulgarian Academy of Sciences](https://www.bas.bg/) |

**Address**: БАН IV км., ул. "Акад. Георги Бончев" 2, Блок 2, 1113 София

## 📁 Project Structure

```
energy-efficiency-calculator/
├── public/
│   ├── index.html        # Main HTML (two-column layout)
│   ├── styles.css        # Theming & responsive styles
│   ├── script.js         # Logic, translations & validation
│   ├── admin.html        # Admin panel for materials/settings
│   ├── admin.js          # Admin panel logic
│   ├── logo.png          # Full project logo
│   ├── logo-icon.png     # Square icon for favicon/PWA
│   ├── manifest.json     # PWA manifest
│   └── service-worker.js # Offline support
├── server.js             # Express server
├── package.json          # Dependencies
└── README.md
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**© 2025 Energy Efficiency Project | Bulgarian Academy of Sciences**
