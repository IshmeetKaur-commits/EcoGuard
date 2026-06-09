import { calculateCarbon }
from "../modules/carbon/carbonCalculator.js";

const testCases = [

    {
        domain: "youtube.com",
        visitTime: 300
    },

    {
        domain: "instagram.com",
        visitTime: 600
    },

    {
        domain: "google.com",
        visitTime: 120
    },

    {
        domain: "bbc.com",
        visitTime: 180
    }
];

testCases.forEach(data => {

    console.log(
        calculateCarbon(data)
    );

});