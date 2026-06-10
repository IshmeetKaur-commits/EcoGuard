const generateDashboard =
    require("./dashboardService");

const getDailyTotals =
    require("./dailyTotals");

const getWeeklyTotals =
    require("./weeklyTotals");

const getTopSites =
    require("./topSites");

function buildDashboard(carbonData) {

    const dashboard =
        generateDashboard(
            carbonData
        );

    dashboard.dailyTotal =
        getDailyTotals(
            carbonData
        );

    dashboard.weeklyTotal =
        getWeeklyTotals(
            carbonData
        );

    dashboard.topWebsites =
        getTopSites(
            carbonData
        );

    return dashboard;
}

module.exports = buildDashboard;