const WEBSITE_TYPES = {

    video: [
    "youtube.com",
    "www.youtube.com",
    "netflix.com",
    "www.netflix.com",
    "primevideo.com",
    "www.primevideo.com"
],

social: [
    "facebook.com",
    "www.facebook.com",
    "instagram.com",
    "www.instagram.com",
    "x.com",
    "www.x.com"
],

search: [
    "google.com",
    "www.google.com",
    "bing.com",
    "www.bing.com"
],

news: [
    "bbc.com",
    "www.bbc.com",
    "cnn.com",
    "www.cnn.com"
]
};

function getWebsiteType(domain) {

    domain = domain.toLowerCase();

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

const ENERGY_RATES = {

    
    video: 0.08,

    social: 0.05,

    search: 0.02,

    news: 0.03,

    default: 0.04
};

const CARBON_FACTOR = 0.475;

export function calculateCarbon(browsingData) {

    const {
        domain,
        visitTime
    } = browsingData;

    const websiteType = getWebsiteType(domain);
    
    const minutes = visitTime / 60;

   const finalEnergyUsed =
    Number(
        energyUsed.toFixed(2)
    );

    const carbonEmission =
    Number(
        (energyUsed * CARBON_FACTOR)
            .toFixed(2)
    );

return {
    domain,
    visitTime,
    carbonEmission,
    energyUsed: finalEnergyUsed
};
}