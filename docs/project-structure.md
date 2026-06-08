# EcoGuard Project Structure

## Repository Layout

```text
EcoGuard
│
├── manifest.json
│
├── assets
│   ├── icons
│   └── images
│
├── background
│
├── popup
│
├── dashboard
│
├── modules
│   ├── tracker
│   ├── carbon
│   ├── privacy
│   └── ai
│
├── storage
│
├── schemas
│
├── tests
│
└── docs
```

---

## Folder Responsibilities

### assets

Contains:

- Extension icons
- Images
- Logos

---

### background

Contains:

- Chrome background service worker
- Browser event listeners

---

### popup

Contains:

- Extension popup UI

Files:

- popup.html
- popup.css
- popup.js

---

### dashboard

Contains:

- Analytics dashboard

Files:

- dashboard.html
- dashboard.css
- dashboard.js

---

### modules/tracker

Owner:

Team Member 1

Responsibilities:

- URL tracking
- Time tracking
- Domain extraction

---

### modules/carbon

Owner:

Team Member 2

Responsibilities:

- Carbon calculations
- Energy estimations

---

### modules/privacy

Owner:

Team Member 3

Responsibilities:

- Privacy checks
- Risk scoring
- Tracker analysis

---

### modules/ai

Owner:

Team Member 4

Responsibilities:

- AI recommendations
- Prompt generation

---

### storage

Responsibilities:

- Chrome storage operations
- Data persistence

---

### schemas

Responsibilities:

- JSON schemas
- Data validation models

---

### tests

Responsibilities:

- Unit tests
- Integration tests

```
