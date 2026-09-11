<div align="center">

<img src="public/logo.png" alt="Trackr Logo" width="100" height="100" style="border-radius: 24px;" />

# Trackr

**Smart Expense & Budget Tracker — Free, Private, No Sign-Up Required**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-6366F1?style=for-the-badge&logo=vercel)](https://trackr.prashantxbuilds.dev)
[![GitHub](https://img.shields.io/badge/GitHub-prashantxbuilds-181717?style=for-the-badge&logo=github)](https://github.com/prashantxbuilds/Trackr)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## ✨ Features

- 💸 **Track Income & Expenses** — Log transactions instantly with categories, amounts, and notes
- 📊 **Visual Analytics** — Beautiful pie charts and bar graphs to understand spending patterns
- 🎯 **Budget Management** — Set monthly limits per category with real-time progress bars
- 🗑️ **Recycle Bin** — Deleted transactions go to trash; restore or permanently delete anytime
- 📅 **Transaction History** — Full searchable history with date filters
- 🧾 **Transaction Details** — PhonePe-style receipt view on every transaction
- 📤 **Export to CSV/Excel** — Export all data with proper date formatting
- 🔄 **Reset with Export** — Option to export data before resetting
- 🌙 **Dark Mode** — Full dark/light theme support
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile
- 🔒 **100% Private** — All data stays on your device (localStorage), no server, no cloud
- ⚡ **No Sign-Up** — Open and start using instantly

---

## 🖼️ Screenshots

| Dashboard | Analytics | Budget |
|-----------|-----------|--------|
| Track your daily spending at a glance | Visual charts for spending patterns | Per-category budget with daily avg |

---

## 🚀 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI Framework |
| Vite | 8 | Build Tool |
| TypeScript | 5.7 | Type Safety |
| Tailwind CSS | v4 | Styling |
| React Router | 8 | Navigation |
| Recharts | 3 | Charts & Analytics |
| Lucide React | latest | Icons |
| Capacitor | 8 | Android App |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- pnpm or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/prashantxbuilds/Trackr.git
cd Trackr

# Install dependencies
npm install

# Start development server
npm run dev
```

App will be available at `http://localhost:8443`

### Build for Production

```bash
npm run build
```

---

## 📱 Android APK (via Capacitor)

Trackr can be built as a native Android app using Capacitor.

### Prerequisites
- Android Studio installed
- JDK 17+
- `ANDROID_HOME` environment variable set

### Build APK

```bash
# Build web assets + sync to Android
npm run cap:sync

# Open in Android Studio
npm run cap:open
```

Then in Android Studio: **Build → Build APK(s)**

Debug APK output: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📁 Project Structure

```
Trackr/
├── src/
│   ├── pages/          # Dashboard, Stats, Budget, History, Settings, Landing
│   ├── components/     # Layout, Modals, Charts, UI components
│   ├── context/        # AppContext (global state + localStorage)
│   ├── assets/         # Logo and static assets
│   ├── utils.ts        # Helper functions (currency, date, export)
│   └── data.ts         # Default categories and types
├── android/            # Capacitor Android project
├── public/             # Static files (favicon, logo)
├── capacitor.config.ts # Capacitor configuration
└── vite.config.ts      # Vite configuration
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for web production |
| `npm run build:cap` | Build for Capacitor (relative paths) |
| `npm run cap:sync` | Build + sync to Android |
| `npm run cap:open` | Open Android Studio |
| `npm run preview` | Preview production build |

---

## 🗂️ Key Features In Detail

### Transaction ID Format
Every transaction gets a unique ID in format `T<YYMMDD><seq>`.
Example: `T26091101` = 1st transaction on Sep 11, 2026

### Budget Tracking
- Each expense category has its own monthly budget limit
- Progress bar uses the category's own color
- Daily average spend shown per category
- Projected end-of-month spend calculated automatically

### Recycle Bin
- Deleted transactions move to trash (not permanently deleted)
- Restore anytime from Settings → Recycle Bin
- Empty trash or delete individual items permanently

### Export to CSV
- Exports with proper date format (`DD-Mon-YYYY`)
- UTF-8 BOM for correct Excel display
- Includes category name, amount, type, date, and notes

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ by [prashantxbuilds](https://github.com/prashantxbuilds)

**Your data never leaves your device.**

</div>
