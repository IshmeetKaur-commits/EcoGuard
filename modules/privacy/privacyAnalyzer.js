function analyzePrivacy(data) {

    const domain = data.domain || "";
    const url = data.url || "";

    let riskScore = 0;
    let issues = [];

    // HTTPS check
    if (!url.startsWith("https://")) {
        riskScore += 30;
        issues.push("Website does not use HTTPS");
    }

    // Social Media Tracking
    const socialMediaSites = [
        "facebook.com",
        "instagram.com",
        "twitter.com",
        "x.com",
        "tiktok.com"
    ];

    if (socialMediaSites.includes(domain)) {
        riskScore += 25;
        issues.push("Social media tracking");
    }

    // Search Engine Tracking
    const searchSites = [
        "google.com",
        "bing.com",
        "yahoo.com"
    ];

    if (searchSites.includes(domain)) {
        riskScore += 15;
        issues.push("Search activity tracking");
    }

    // Streaming Sites
    const streamingSites = [
        "youtube.com",
        "netflix.com",
        "spotify.com"
    ];

    if (streamingSites.includes(domain)) {
        riskScore += 20;
        issues.push("Advertising trackers");
    }

    // General Cookie Risk
    riskScore += 10;
    issues.push("Third-party cookies");

    if (riskScore > 100) {
        riskScore = 100;
    }

    return {
        domain,
        riskScore,
        issues
    };
}

module.exports = analyzePrivacy;