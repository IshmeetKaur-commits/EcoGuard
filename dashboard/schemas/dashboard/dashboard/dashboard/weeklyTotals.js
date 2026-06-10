function getWeeklyTotals(carbonData) {

    const now = new Date();

    const weekAgo =
        new Date();

    weekAgo.setDate(
        now.getDate() - 7
    );

    const weeklyData =
        carbonData.filter(item =>
            new Date(
                item.timestamp
            ) >= weekAgo
        );

    return weeklyData.reduce(
        (sum, item) =>
            sum + item.carbonEmission,
        0
    );
}

module.exports = getWeeklyTotals;