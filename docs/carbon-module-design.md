# Carbon Estimation Module Design

## Module Owner

Carbon Developer

---

## Purpose

The Carbon Estimation Module estimates the environmental impact of a user's web browsing activity.

The module receives browsing information from the Tracker Module and calculates:

- Estimated energy usage
- Estimated carbon emissions

The calculated values are then provided to the AI Recommendation Module and Dashboard Module.

---

## Input Data

The module receives BrowsingData from the Tracker Module.

Example:

```json
{
  "domain": "youtube.com",
  "url": "https://youtube.com",
  "visitTime": 300,
  "timestamp": "2026-06-08T18:30:00Z"
}
```

### Field Description

| Field | Description |
|---------|------------|
| domain | Website domain |
| url | Full URL |
| visitTime | Time spent on website in seconds |
| timestamp | Time of record creation |

---

## Output Data

The module produces CarbonData.

Example:

```json
{
  "domain": "youtube.com",
  "visitTime": 300,
  "carbonEmission": 4.8,
  "energyUsed": 20.5
}
```

### Field Description

| Field | Description |
|---------|------------|
| domain | Website domain |
| visitTime | Time spent on website |
| carbonEmission | Estimated CO₂ emission |
| energyUsed | Estimated energy usage |

---

## Assumptions

Since a browser extension cannot directly measure real-world carbon emissions, the module will use estimation techniques.

Assumptions include:

- Video streaming websites consume more energy.
- Social media websites consume medium energy.
- Search engines consume low energy.
- Longer browsing sessions consume more energy.
- Carbon emissions increase with energy usage.

---

## Website Categories

The module categorizes websites into groups.

### Video

Examples:

- youtube.com
- netflix.com
- primevideo.com

### Social Media

Examples:

- facebook.com
- instagram.com
- x.com

### Search Engines

Examples:

- google.com
- bing.com

### News Websites

Examples:

- bbc.com
- cnn.com

### Default

All uncategorized websites.

---

## Processing Flow

BrowsingData
↓
Identify Website Category
↓
Estimate Energy Usage
↓
Estimate Carbon Emission
↓
Return CarbonData

---

## Future Enhancements

Possible future improvements:

- Real carbon databases
- Region-specific carbon factors
- Data transfer estimation
- Device power profiling
- Machine learning based estimation
