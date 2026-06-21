# 🎬 CineShelf

A premium personal movie catalog and recommendation hub. Built for cinema enthusiasts who want to track, rate, and share their watchlist with the world.

## 🌟 Features

- **IMDb-style grid** of curated movie and series recommendations
- **Genre & category filters** — Horror, Thriller, Action, War, Sci-Fi, Drama, and more
- **Personal "CineScore" ratings** alongside public ratings
- **"Surprise Me" 🎲** — random movie recommendation picker
- **Mark as Watched** — visitors can track what they've seen with a green checkmark stamp
- **Hide Watched filter** — show only unwatched recommendations
- **Hamburger drawer** on mobile — smooth left-to-right sliding filter panel
- **Responsive layout** — 2-column mobile grid, full desktop sidebar
- **Curator Portal (admin mode)** — hidden behind the `© CineShelf` footer text
  - Add, edit, and delete recommendations
  - Export/import the library as JSON backup
  - Change the access passcode securely

## 🚀 Running Locally

Open `index.html` directly in your browser, **or** run a local dev server:

```bash
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000).

## 🔐 Curator Access

The admin login is hidden from visitors. To access it:

1. Scroll to the footer and click the `© CineShelf` copyright text
2. Enter your passcode (default: `admin`)
3. Change the passcode immediately after first login via the **Change Passcode** button

> ⚠️ This project uses `localStorage` for data persistence. Your data lives in the browser and is not synced to any server.

## 📁 Project Structure

```
cineshelf/
├── index.html      # App layout & modals
├── styles.css      # Cinematic dark mode design system
├── data.js         # Seed movie/series data
├── app.js          # App logic, filters, admin, storage
└── package.json    # Dev server script
```

## 📽️ Seeded Titles

Comes pre-loaded with 10 carefully reviewed titles:

| Title | Genre | Type |
|---|---|---|
| Mad Max: Fury Road | Action / Sci-Fi | Movie |
| The Conjuring | Horror | Movie |
| Get Out | Horror / Thriller | Movie |
| Inception | Thriller / Action | Movie |
| Shutter Island | Thriller / Mystery | Movie |
| 1917 | War / Drama | Movie |
| Saving Private Ryan | War / Drama | Movie |
| Breaking Bad | Thriller / Drama | Series |
| Chernobyl | Drama / Thriller | Series |
| Stranger Things | Horror / Sci-Fi | Series |

---

Built with ❤️ using plain HTML, CSS, and Vanilla JavaScript.
