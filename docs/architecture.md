# EcoGuard Architecture Document

## Project Overview

EcoGuard is a Chrome Extension designed to help users understand the environmental and privacy impact of their web browsing.

The extension monitors browsing activity, estimates carbon emissions generated from website usage, analyzes privacy risks, and provides AI-generated recommendations to encourage safer and more sustainable browsing habits.

---

## Project Objectives

The primary objectives of EcoGuard are:

1. Track browsing activity.
2. Measure approximate carbon footprint of visited websites.
3. Analyze privacy and security risks.
4. Generate AI-powered recommendations.
5. Present results through an interactive dashboard.

---

# System Architecture

The EcoGuard system consists of six major modules:

1. Tracker Module
2. Carbon Estimation Module
3. Privacy Analysis Module
4. AI Recommendation Module
5. Storage Module
6. Dashboard Module

---

# High-Level Data Flow

User Browsing Activity
        ↓
Tracker Module
        ↓
Carbon Estimation Module
        ↓
Privacy Analysis Module
        ↓
AI Recommendation Module
        ↓
Storage Module
        ↓
Dashboard UI

---

# Module Descriptions

## 1. Tracker Module

Purpose:

Capture browsing activity from the Chrome browser.

Responsibilities:

- Detect active tabs
- Record visited URLs
- Track time spent on websites
- Extract domain names
- Send browsing data to other modules

Example Output:

```json
{
  "domain": "youtube.com",
  "url": "https://youtube.com",
  "visitTime": 300,
  "timestamp": "2026-06-08T10:00:00Z"
}
```

---

## 2. Carbon Estimation Module

Purpose:

Estimate environmental impact of browsing.

Responsibilities:

- Calculate estimated energy usage
- Estimate carbon emissions
- Store emission metrics

Example Output:

```json
{
  "carbonEmission": 4.5,
  "energyUsed": 20
}
```

---

## 3. Privacy Analysis Module

Purpose:

Identify privacy risks associated with websites.

Responsibilities:

- Check HTTPS usage
- Detect tracker presence
- Assign privacy risk score
- Generate issue reports

Example Output:

```json
{
  "riskScore": 70,
  "issues": [
    "Third-party trackers detected",
    "Weak privacy policy"
  ]
}
```

---

## 4. AI Recommendation Module

Purpose:

Provide actionable suggestions to users.

Responsibilities:

- Analyze carbon footprint data
- Analyze privacy risk data
- Generate personalized recommendations
- Prioritize recommendations

Example Output:

```json
{
  "recommendation": "Reduce video streaming quality and use tracker blockers.",
  "severity": "medium"
}
```

---

## 5. Storage Module

Purpose:

Store collected and generated data.

Responsibilities:

- Save browsing history
- Save emission records
- Save privacy analysis results
- Save recommendations

Technology:

- Chrome Storage API

---

## 6. Dashboard Module

Purpose:

Display information to users.

Responsibilities:

- Show browsing statistics
- Show carbon emission metrics
- Show privacy risk scores
- Display AI recommendations
- Display charts and graphs

---

# Team Responsibilities

## Team Member 1 - Tracker Module

Responsible for:

- Browser monitoring
- URL tracking
- Time tracking
- Data collection

Deliverables:

- tracker.js
- background.js

---

## Team Member 2 - Carbon Module

Responsible for:

- Carbon calculation logic
- Energy estimation logic

Deliverables:

- carbonCalculator.js

---

## Team Member 3 - Privacy Module

Responsible for:

- Privacy risk detection
- Tracker analysis
- Risk scoring

Deliverables:

- privacyAnalyzer.js

---

## Team Member 4 - AI and Dashboard Module

Responsible for:

- AI recommendation engine
- Dashboard interface
- Charts and visualization

Deliverables:

- aiEngine.js
- dashboard.html
- dashboard.js
- dashboard.css

---

# Technology Stack

Frontend:

- HTML
- CSS
- JavaScript

Extension Platform:

- Chrome Extension Manifest V3

Storage:

- Chrome Storage API

Visualization:

- Chart.js

AI:

- OpenAI API (or compatible LLM API)

Version Control:

- GitHub

---

# Success Criteria

The project will be considered complete when:

1. Browsing activity is tracked.
2. Carbon emissions are calculated.
3. Privacy risks are analyzed.
4. AI recommendations are generated.
5. Dashboard displays all collected information.
6. Modules are integrated successfully.

---

# Future Enhancements

Possible future features:

- Weekly sustainability reports
- User accounts
- Cross-device synchronization
- Website sustainability rankings
- Gamification and eco-score badges
