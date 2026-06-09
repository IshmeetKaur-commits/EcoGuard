const WEBSITE_TYPES = {

    video: [
        "youtube.com",
        "netflix.com",
        "primevideo.com"
    ],

    social: [
        "facebook.com",
        "instagram.com",
        "x.com"
    ],

    search: [
        "google.com",
        "bing.com"
    ],

    news: [
        "bbc.com",
        "cnn.com"
    ]
};

function getWebsiteType(domain) {

    if (WEBSITE_TYPES.video.includes(domain))
        return "video";

    if (WEBSITE_TYPES.social.includes(domain))
        return "social";

    if (WEBSITE_TYPES.search.includes(domain))
        return "search";

    if (WEBSITE_TYPES.news.includes(domain))
        return "news";

    return "default";
}

export function calculateCarbon(browsingData) {

    const {
        domain,
        visitTime
    } = browsingData;

    const websiteType = getWebsiteType(domain);

    return {
        domain,
        visitTime,
        websiteType,
        carbonEmission: 0,
        energyUsed: 0
    };
}