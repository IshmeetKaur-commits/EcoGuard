import { calculateCarbon }
from "../modules/carbon/carbonCalculator.js";

const youtubeData = {
    domain: "youtube.com",
    visitTime: 300
};

console.log(
    calculateCarbon(youtubeData)
);