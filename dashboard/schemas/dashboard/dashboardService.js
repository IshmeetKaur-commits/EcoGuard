function generateDashboard(carbonData) {

    const totalCarbonEmission =
        carbonData.reduce(
            (sum, item) => sum + item.carbonEmission,
            0
        );

    const totalEnergyUsed =
        carbonData.reduce(
            (sum, item) => sum + item.energyUsed,
            0
        );

    const topWebsites =
        [...carbonData]
        .sort(
            (a, b) =>
                b.carbonEmission -
                a.carbonEmission
        )
        .slice(0, 10);

    return {
        totalCarbonEmission,
        totalEnergyUsed,
        topWebsites
    };
}

module.exports = generateDashboard;