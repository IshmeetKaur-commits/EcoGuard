function getTopSites(carbonData) {

    return carbonData
        .sort(
            (a, b) =>
                b.carbonEmission -
                a.carbonEmission
        )
        .slice(0, 5);
}

module.exports = getTopSites;