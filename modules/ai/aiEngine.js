
/** EcoGuard AI Engine - Member 4 Enhanced AI Recommendations + Insights */
function computeEcoScore(carbonEmission, riskScore) {
  const carbonScore = Math.max(0, 100 - carbonEmission * 10);
  const privacyScore = Math.max(0, 100 - riskScore);
  return Math.round((carbonScore + privacyScore) / 2);
}
function getRiskBadge(riskScore) {
  if (riskScore >= 80) return "CRITICAL";
  if (riskScore >= 60) return "HIGH";
  if (riskScore >= 40) return "MEDIUM";
  return "LOW";
}
function getPrivacyLevel(riskScore) {
  if (riskScore >= 80) return "Critical";
  if (riskScore >= 60) return "High";
  if (riskScore >= 40) return "Moderate";
  return "Safe";
}
function generateRecommendation(carbonEmission, riskScore, topSites = []) {
  const recs = [];
  const highestSite = topSites[0]?.site || "your top browsing site";
  if (carbonEmission > 8) recs.push(`Critical carbon usage detected. Reduce time on ${highestSite}, avoid long video streaming, and close unused tabs.`);
  else if (carbonEmission > 5) recs.push(`High emissions detected. ${highestSite} is currently your highest impact website. Reduce streaming quality and disable auto-play.`);
  else if (carbonEmission > 3) recs.push(`Moderate emissions. Close unused tabs and reduce browsing time on ${highestSite}.`);
  else recs.push("Carbon usage is low. Your browsing pattern is currently eco-friendly.");
  if (riskScore > 80) recs.push("Privacy risk is critical. Use tracker blockers, clear third-party cookies, and review site permissions.");
  else if (riskScore > 70) recs.push("Privacy risk is high. Use a tracker blocker and review privacy settings.");
  else if (riskScore > 50) recs.push("Privacy risk is moderate. Clear third-party cookies regularly.");
  else recs.push("Privacy status looks safe.");
  return recs.join(" ");
}
function generateAIInsights(data) {
  const carbonEmission = data.carbonEmission || 0;
  const riskScore = data.riskScore || 0;
  const topSites = data.topSites || [];
  const ecoScore = computeEcoScore(carbonEmission, riskScore);
  const highestCarbonSite = topSites[0]?.site || "No data";
  const mostVisitedSite = [...topSites].sort((a,b)=>(b.time||0)-(a.time||0))[0]?.site || highestCarbonSite;
  const tomorrowCarbon = +(carbonEmission * 1.15).toFixed(2);
  const weeklyCarbon = +(tomorrowCarbon * 7).toFixed(2);
  const reductionPotential = Math.min(60, Math.max(5, 100 - ecoScore));
  const insightPoints = [];
  if (topSites.length > 0) insightPoints.push(`${highestCarbonSite} is your highest carbon contributor right now.`);
  if (riskScore >= 60) insightPoints.push("Your privacy risk is high because multiple sites show tracking or high request activity.");
  else insightPoints.push("Your privacy risk is currently manageable.");
  if (carbonEmission > 3) insightPoints.push("Reducing video/social browsing time can noticeably lower your digital footprint.");
  else insightPoints.push("Your carbon impact is low, but keeping tabs closed will help maintain it.");
  return { ecoScore, riskBadge:getRiskBadge(riskScore), privacyLevel:getPrivacyLevel(riskScore), mostVisitedSite, highestCarbonSite, tomorrowCarbon, weeklyCarbon, reductionPotential, insightPoints };
}
function analyzeEcoData(data) {
  const insights = generateAIInsights(data || {});
  return {
    recommendation: generateRecommendation(data?.carbonEmission || 0, data?.riskScore || 0, data?.topSites || []),
    ecoScore: insights.ecoScore,
    riskBadge: insights.riskBadge,
    insights
  };
}
