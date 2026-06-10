const $ = (id) => document.getElementById(id);

let carbonChart;
let privacyChart;
let trendChart;
let aiInsightsChart;

function safeChromeAvailable() {
    return (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
    );
}

function getStorageData() {
    return new Promise((resolve) => {
        if (!safeChromeAvailable()) {
            resolve({
                browsingData: [
                    {
                        domain: "youtube.com",
                        url: "https://youtube.com",
                        visitTime: 220,
                        timestamp: new Date().toISOString()
                    },
                    {
                        domain: "github.com",
                        url: "https://github.com",
                        visitTime: 120,
                        timestamp: new Date().toISOString()
                    },
                    {
                        domain: "instagram.com",
                        url: "https://instagram.com",
                        visitTime: 80,
                        timestamp: new Date().toISOString()
                    }
                ],

                requestStats: {
                    "youtube.com": {
                        requests: 90
                    },
                    "github.com": {
                        requests: 25
                    },
                    "instagram.com": {
                        requests: 55
                    }
                }
            });

            return;
        }

        chrome.storage.local.get(
            ["browsingData", "requestStats"],
            (result) => {
                resolve({
                    browsingData: result.browsingData || [],
                    requestStats: result.requestStats || {}
                });
            }
        );
    });
}

function localGroupVisitsByDomain(visits) {
    if (typeof groupVisitsByDomain === "function") {
        return groupVisitsByDomain(visits);
    }

    const map = {};

    visits.forEach((visit) => {
        if (!visit.domain) {
            return;
        }

        if (!map[visit.domain]) {
            map[visit.domain] = {
                domain: visit.domain,
                totalTime: 0,
                visits: 0,
                lastUrl: visit.url
            };
        }

        map[visit.domain].totalTime += visit.visitTime || 0;
        map[visit.domain].visits += 1;
        map[visit.domain].lastUrl = visit.url;
    });

    return Object.values(map).sort(
        (a, b) => b.totalTime - a.totalTime
    );
}

/*
    Carbon adapter:
    When Member 2 sends carbonCalculator.js,
    this function will use calculateCarbonFromVisits().
*/
function localCalculateCarbon(row, requestStats) {
    if (typeof calculateCarbonFromVisits === "function") {
        return calculateCarbonFromVisits(row, requestStats);
    }

    const minutes = row.totalTime / 60;
    const requests = requestStats[row.domain]?.requests || 0;

    const energyUsed = +(
        minutes * 0.08 +
        requests * 0.002
    ).toFixed(2);

    const carbonEmission = +(
        energyUsed * 0.233
    ).toFixed(2);

    return {
        domain: row.domain,
        visitTime: row.totalTime,
        visits: row.visits,
        energyUsed,
        carbonEmission
    };
}

/*
    Privacy adapter:
    Uses Member 3 privacyAnalyzer.js when available.
*/
function localAnalyzePrivacy(row, requestStats) {
    if (typeof analyzePrivacyFromDomain === "function") {
        return analyzePrivacyFromDomain(row, requestStats);
    }

    const requests = requestStats[row.domain]?.requests || 0;

    let riskScore = 15;

    const issues = [];

    if (row.lastUrl && row.lastUrl.startsWith("https://")) {
        issues.push("HTTPS connection secure");
    } else {
        riskScore += 25;
        issues.push("Non-HTTPS or unknown connection");
    }

    if (requests > 80) {
        riskScore += 25;
        issues.push("High number of network requests");
    } else if (requests > 30) {
        riskScore += 15;
        issues.push("Moderate number of network requests");
    }

    if (
        /youtube|instagram|tiktok|facebook|snapchat|ads|analytics/i.test(
            row.domain
        )
    ) {
        riskScore += 20;
        issues.push(
            "Possible tracker or social-media tracking risk"
        );
    }

    return {
        domain: row.domain,
        riskScore: Math.min(100, riskScore),
        issues
    };
}

async function loadRealData() {
    const { browsingData, requestStats } =
        await getStorageData();

    const grouped = localGroupVisitsByDomain(browsingData);

    if (grouped.length === 0) {
        updateDashboard({
            carbonEmission: 0,
            energyUsed: 0,
            riskScore: 0,
            siteCount: 0,
            dailyCarbon: 0,
            weeklyCarbon: 0,
            mostExpensiveSite: "No data",
            aiConfidence: 0,
            issues: [
                "No browsing data yet. Open some websites, then refresh EcoGuard."
            ],
            topSites: []
        });

        return;
    }

    const carbonRows = grouped.map((row) =>
        localCalculateCarbon(row, requestStats)
    );

    const privacyRows = grouped.map((row) =>
        localAnalyzePrivacy(row, requestStats)
    );

    const totalCarbon = +carbonRows
        .reduce((sum, row) => sum + row.carbonEmission, 0)
        .toFixed(2);

    const totalEnergy = +carbonRows
        .reduce((sum, row) => sum + row.energyUsed, 0)
        .toFixed(2);

    const avgRisk = Math.round(
        privacyRows.reduce(
            (sum, row) => sum + row.riskScore,
            0
        ) / privacyRows.length
    );

    const issues = [
        ...new Set(
            privacyRows.flatMap((row) => row.issues)
        )
    ].slice(0, 6);

    const topSites = carbonRows
        .sort((a, b) => b.carbonEmission - a.carbonEmission)
        .slice(0, 5)
        .map((row) => ({
            site: row.domain,
            emission: row.carbonEmission,
            time: row.visitTime,
            tip: row.domain.includes("youtube")
                ? "Lower video quality or use audio-only mode."
                : "Close unused tabs and reduce session time."
        }));

    const dailyCarbon = totalCarbon;

    const weeklyCarbon = +(totalCarbon * 7).toFixed(2);

    const mostExpensiveSite =
        topSites[0]?.site || "No data";

    const aiConfidence =
        grouped.length >= 3 ? 87 : 70;

    updateDashboard({
        carbonEmission: totalCarbon,
        energyUsed: totalEnergy,
        riskScore: avgRisk,
        siteCount: grouped.length,
        dailyCarbon,
        weeklyCarbon,
        mostExpensiveSite,
        aiConfidence,
        issues,
        topSites
    });
}

function updateDashboard(data) {
    const result = analyzeEcoData({
        carbonEmission: data.carbonEmission,
        riskScore: data.riskScore,
        topSites: data.topSites
    });

    $("carbon-value").textContent =
        data.carbonEmission;

    $("energy-value").textContent =
        data.energyUsed;

    $("risk-value").textContent =
        data.riskScore;

    $("site-count").textContent =
        data.siteCount || 0;

    if ($("daily-carbon")) {
        $("daily-carbon").textContent =
            data.dailyCarbon || 0;
    }

    if ($("weekly-carbon")) {
        $("weekly-carbon").textContent =
            data.weeklyCarbon || 0;
    }

    if ($("most-expensive-site")) {
        $("most-expensive-site").textContent =
            data.mostExpensiveSite || "No data";
    }

    if ($("ai-confidence")) {
        $("ai-confidence").textContent =
            data.aiConfidence || 0;
    }

    renderIssues(data.issues || []);

    applyBadge(result.riskBadge);

    animateRing(result.ecoScore);

    renderTopSites(data.topSites || []);

    renderCharts(data);

    renderAIInsights(data, result);

    $("reco-text").textContent =
        result.recommendation;
}

function renderIssues(issues) {
    $("issue-list").innerHTML = issues
        .map(
            (issue) =>
                `<li><span class="issue-dot"></span>${issue}</li>`
        )
        .join("");
}

function applyBadge(badge) {
    const badgeEl = $("risk-badge");

    badgeEl.textContent = badge;

    badgeEl.className = "risk-badge";

    if (badge === "LOW") {
        badgeEl.classList.add("badge-low");
    } else if (badge === "MEDIUM") {
        badgeEl.classList.add("badge-medium");
    } else if (badge === "HIGH") {
        badgeEl.classList.add("badge-high");
    } else {
        badgeEl.classList.add("badge-critical");
    }
}

function animateRing(score) {
    const ring = document.querySelector(".ring-fill");
    const scoreValue = $("eco-score-value");
    const tagline = $("eco-score-tagline");

    const circumference = 490;

    const offset =
        circumference - (score / 100) * circumference;

    ring.style.strokeDashoffset = offset;

    if (score >= 70) {
        ring.style.stroke = "var(--green)";
        tagline.textContent =
            "Great! Your browsing is eco-conscious.";
    } else if (score >= 40) {
        ring.style.stroke = "var(--amber)";
        tagline.textContent =
            "Average impact. You can improve your digital habits.";
    } else {
        ring.style.stroke = "var(--red)";
        tagline.textContent =
            "High impact detected. Action is recommended.";
    }

    let current = 0;

    clearInterval(window.scoreTimer);

    window.scoreTimer = setInterval(() => {
        current++;

        scoreValue.textContent = current;

        if (current >= score) {
            clearInterval(window.scoreTimer);
        }
    }, 12);
}

function renderTopSites(topSites) {
    if (!topSites.length) {
        $("top-sites-list").innerHTML =
            "<p>No website data yet.</p>";

        return;
    }

    const maxEmission = Math.max(
        ...topSites.map((site) => site.emission),
        0.01
    );

    $("top-sites-list").innerHTML = topSites
        .map((site, index) => {
            const width =
                (site.emission / maxEmission) * 100;

            return `
                <div class="site-row">
                    <span class="site-rank">
                        ${index + 1}
                    </span>

                    <div class="site-info">
                        <strong>${site.site}</strong>
                        <small>${site.tip}</small>
                    </div>

                    <div class="site-bar-bg">
                        <div
                            class="site-bar-fill"
                            style="width:${width}%">
                        </div>
                    </div>

                    <span class="site-emission">
                        ${site.emission}g
                    </span>
                </div>
            `;
        })
        .join("");
}

function renderCharts(data) {
    if (carbonChart) {
        carbonChart.destroy();
    }

    if (privacyChart) {
        privacyChart.destroy();
    }

    if (trendChart) {
        trendChart.destroy();
    }

    carbonChart = new Chart($("carbon-chart"), {
        type: "bar",

        data: {
            labels: ["Current Session"],

            datasets: [
                {
                    data: [data.carbonEmission],
                    backgroundColor:
                        "rgba(57,255,136,.35)",
                    borderColor: "#39ff88",
                    borderWidth: 2,
                    borderRadius: 12
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    privacyChart = new Chart($("privacy-chart"), {
        type: "doughnut",

        data: {
            labels: ["Risk", "Safe"],

            datasets: [
                {
                    data: [
                        data.riskScore,
                        Math.max(0, 100 - data.riskScore)
                    ],
                    backgroundColor: [
                        "#ffb020",
                        "rgba(57,255,136,.25)"
                    ],
                    borderWidth: 0
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "70%"
        }
    });

    const labels = (data.topSites || []).map(
        (site) => site.site
    );

    const values = (data.topSites || []).map(
        (site) =>
            Math.round((site.time || 0) / 60)
    );

    trendChart = new Chart($("trend-chart"), {
        type: "bar",

        data: {
            labels: labels.length ? labels : ["No data"],

            datasets: [
                {
                    label: "Minutes Spent",
                    data: values.length ? values : [0],
                    backgroundColor:
                        "rgba(0,217,255,.25)",
                    borderColor: "#00d9ff",
                    borderWidth: 2,
                    borderRadius: 12
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function renderAIInsights(data, result) {
    const insights = result.insights;

    if (!insights) {
        return;
    }

    if ($("ai-most-visited")) {
        $("ai-most-visited").textContent =
            insights.mostVisitedSite;
    }

    if ($("ai-highest-carbon")) {
        $("ai-highest-carbon").textContent =
            insights.highestCarbonSite;
    }

    if ($("ai-privacy-level")) {
        $("ai-privacy-level").textContent =
            insights.privacyLevel;
    }

    if ($("ai-reduction-potential")) {
        $("ai-reduction-potential").textContent =
            insights.reductionPotential + "%";
    }

    if ($("ai-tomorrow-carbon")) {
        $("ai-tomorrow-carbon").textContent =
            insights.tomorrowCarbon + "g";
    }

    if ($("ai-weekly-carbon")) {
        $("ai-weekly-carbon").textContent =
            insights.weeklyCarbon + "g";
    }

    if ($("ai-points")) {
        $("ai-points").innerHTML =
            insights.insightPoints
                .map((point) => `<li>${point}</li>`)
                .join("");
    }

    const canvas = $("ai-insights-chart");

    if (!canvas) {
        return;
    }

    if (aiInsightsChart) {
        aiInsightsChart.destroy();
    }

    aiInsightsChart = new Chart(canvas, {
        type: "line",

        data: {
            labels: [
                "Today",
                "Tomorrow",
                "Weekly Avg",
                "Reduced Goal"
            ],

            datasets: [
                {
                    label: "Carbon Forecast",

                    data: [
                        data.carbonEmission,
                        insights.tomorrowCarbon,
                        +(insights.weeklyCarbon / 7).toFixed(2),
                        +(
                            data.carbonEmission *
                            (1 - insights.reductionPotential / 100)
                        ).toFixed(2)
                    ],

                    borderColor: "#39ff88",

                    backgroundColor:
                        "rgba(57,255,136,.18)",

                    pointBackgroundColor: "#00d9ff",

                    pointRadius: 5,

                    tension: 0.4,

                    fill: true
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                },

                tooltip: {
                    callbacks: {
                        label: (context) =>
                            ` ${context.parsed.y}g CO₂`
                    }
                }
            },

            scales: {
                y: {
                    beginAtZero: true,

                    ticks: {
                        callback: (value) =>
                            value + "g"
                    }
                }
            }
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    localStorage.setItem(
        "ecoguard-theme",
        isLight ? "light" : "dark"
    );

    $("theme-toggle-btn").textContent =
        isLight ? "Dark Mode" : "Light Mode";
}

function exportReport() {
    window.print();
}

function clearData() {
    if (!safeChromeAvailable()) {
        alert(
            "Open this as a Chrome Extension to clear real storage."
        );

        return;
    }

    chrome.storage.local.set(
        {
            browsingData: [],
            requestStats: {}
        },
        () => loadRealData()
    );
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme =
        localStorage.getItem("ecoguard-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light");
        $("theme-toggle-btn").textContent = "Dark Mode";
    }

    $("theme-toggle-btn").addEventListener(
        "click",
        toggleTheme
    );

    $("export-btn").addEventListener(
        "click",
        exportReport
    );

    $("refresh-btn").addEventListener(
        "click",
        loadRealData
    );

    $("clear-btn").addEventListener(
        "click",
        clearData
    );

    loadRealData();

    setInterval(loadRealData, 30000);
});