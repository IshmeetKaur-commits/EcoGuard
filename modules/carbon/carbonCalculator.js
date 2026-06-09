export function calculateCarbon(browsingData) {

    const {
        domain,
        visitTime
    } = browsingData;

    return {
        domain,
        visitTime,
        carbonEmission: 0,
        energyUsed: 0
    };
}