# EcoGuard API Contracts

## Purpose

This document defines how modules communicate with each other.

All team members must follow these contracts exactly.

---

# Data Flow

Tracker
↓
Carbon
↓
Privacy
↓
AI
↓
Dashboard

---

# Module 1: Tracker

Folder:

modules/tracker

Purpose:

Track browsing activity and provide browsing data.

---

Function:

getBrowsingData()

Returns:

```json
{
  "domain": "youtube.com",
  "url": "https://youtube.com",
  "visitTime": 300,
  "timestamp": "2026-06-08T18:30:00Z"
}
```

---

# Module 2: Carbon Calculator

Folder:

modules/carbon

Purpose:

Calculate estimated carbon emissions.

---

Function:

calculateCarbon(browsingData)

Input:

```json
{
  "domain": "youtube.com",
  "url": "https://youtube.com",
  "visitTime": 300,
  "timestamp": "2026-06-08T18:30:00Z"
}
```

Output:

```json
{
  "domain": "youtube.com",
  "visitTime": 300,
  "carbonEmission": 4.8,
  "energyUsed": 20.5
}
```

---

# Module 3: Privacy Analyzer

Folder:

modules/privacy

Purpose:

Analyze privacy risks.

---

Function:

analyzePrivacy(browsingData)

Input:

```json
{
  "domain": "youtube.com",
  "url": "https://youtube.com",
  "visitTime": 300,
  "timestamp": "2026-06-08T18:30:00Z"
}
```

Output:

```json
{
  "domain": "youtube.com",
  "riskScore": 72,
  "issues": [
    "Advertising trackers",
    "Third-party cookies"
  ]
}
```

---

# Module 4: AI Recommendation Engine

Folder:

modules/ai

Purpose:

Generate recommendations.

---

Function:

generateRecommendation(carbonData, privacyData)

Input:

carbonData

```json
{
  "domain": "youtube.com",
  "visitTime": 300,
  "carbonEmission": 4.8,
  "energyUsed": 20.5
}
```

privacyData

```json
{
  "domain": "youtube.com",
  "riskScore": 72,
  "issues": [
    "Advertising trackers"
  ]
}
```

Output:

```json
{
  "domain": "youtube.com",
  "recommendation": "Reduce streaming quality and use a tracker blocker.",
  "severity": "medium"
}
```

---

# Module 5: Dashboard

Folder:

dashboard

Purpose:

Display combined results.

---

Function:

buildDashboardData(
    carbonData,
    privacyData,
    recommendationData
)

Output:

```json
{
  "domain": "youtube.com",
  "carbonEmission": 4.8,
  "riskScore": 72,
  "recommendation": "Reduce streaming quality and use a tracker blocker."
}
```

---

# Error Handling

All modules must return:

```json
{
  "success": false,
  "error": "Description of error"
}
```

when processing fails.

---

# Version

API Version:

1.0

Last Updated:

June 2026
