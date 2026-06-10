function getDailyTotals(carbonData) {

    const today =
        new Date().toDateString();

    const dailyData =
        carbonData.filter(item =>
            new Date(
                item.timestamp
            ).toDateString() === today
        );

    return dailyData.reduce(
        (sum, item) =>
            sum + item.carbonEmission,
        0
    );
}

module.exports = getDailyTotals;