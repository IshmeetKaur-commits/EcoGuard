const analyzePrivacy = require("./privacyAnalyzer");

const testData = [
    {
        domain: "youtube.com",
        url: "https://youtube.com"
    },
    {
        domain: "facebook.com",
        url: "https://facebook.com"
    },
    {
        domain: "google.com",
        url: "https://google.com"
    },
    {
        domain: "example.com",
        url: "http://example.com"
    }
];

for (const site of testData) {
    console.log("\n-------------------");
    console.log(analyzePrivacy(site));
}