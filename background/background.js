console.log("EcoGuard background service started");

let activeTabId = null;
let activeUrl = null;
let activeDomain = null;
let startTime = Date.now();

function getDomain(url) {
    try {
        const parsedUrl = new URL(url);

        if (!parsedUrl.hostname) {
            return null;
        }

        if (
            parsedUrl.protocol.startsWith("chrome") ||
            parsedUrl.protocol.startsWith("edge")
        ) {
            return null;
        }

        return parsedUrl.hostname.replace(/^www\./, "");
    } catch (error) {
        return null;
    }
}

function nowISO() {
    return new Date().toISOString();
}

function getLocal(key, fallback) {
    return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
            resolve(result[key] ?? fallback);
        });
    });
}

function setLocal(object) {
    return new Promise((resolve) => {
        chrome.storage.local.set(object, resolve);
    });
}

async function saveCurrentVisit() {
    if (!activeUrl || !activeDomain) {
        return;
    }

    const visitTime = Math.floor(
        (Date.now() - startTime) / 1000
    );

    if (visitTime < 2) {
        return;
    }

    const browsingData = await getLocal(
        "browsingData",
        []
    );

    browsingData.push({
        domain: activeDomain,
        url: activeUrl,
        visitTime: visitTime,
        timestamp: nowISO()
    });

    await setLocal({
        browsingData: browsingData.slice(-500)
    });

    startTime = Date.now();

    console.log("Saved visit:", {
        domain: activeDomain,
        visitTime: visitTime
    });
}

async function activateTab(tabId) {
    await saveCurrentVisit();

    activeTabId = tabId;
    startTime = Date.now();

    chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError || !tab || !tab.url) {
            return;
        }

        const domain = getDomain(tab.url);

        if (!domain) {
            return;
        }

        activeUrl = tab.url;
        activeDomain = domain;

        console.log("Active tab:", activeDomain);
    });
}

chrome.tabs.onActivated.addListener((activeInfo) => {
    activateTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(
    async (tabId, changeInfo, tab) => {
        if (tabId !== activeTabId) {
            return;
        }

        const nextUrl = changeInfo.url || tab.url;

        if (!nextUrl || nextUrl === activeUrl) {
            return;
        }

        const nextDomain = getDomain(nextUrl);

        if (!nextDomain) {
            return;
        }

        await saveCurrentVisit();

        activeUrl = nextUrl;
        activeDomain = nextDomain;
        startTime = Date.now();

        console.log("URL changed:", activeDomain);
    }
);

chrome.windows.onFocusChanged.addListener(
    async (windowId) => {
        if (windowId === chrome.windows.WINDOW_ID_NONE) {
            await saveCurrentVisit();

            activeTabId = null;
            activeUrl = null;
            activeDomain = null;

            return;
        }

        chrome.tabs.query(
            {
                active: true,
                currentWindow: true
            },
            (tabs) => {
                if (tabs && tabs[0]) {
                    activateTab(tabs[0].id);
                }
            }
        );
    }
);

/*
    Safe webRequest listener.
    This avoids the error:
    Cannot read properties of undefined (reading 'onCompleted')
*/
if (
    chrome.webRequest &&
    chrome.webRequest.onCompleted
) {
    chrome.webRequest.onCompleted.addListener(
        async (details) => {
            const domain = getDomain(details.url);

            if (!domain) {
                return;
            }

            const requestStats = await getLocal(
                "requestStats",
                {}
            );

            if (!requestStats[domain]) {
                requestStats[domain] = {
                    requests: 0,
                    lastSeen: nowISO()
                };
            }

            requestStats[domain].requests += 1;
            requestStats[domain].lastSeen = nowISO();

            await setLocal({
                requestStats: requestStats
            });
        },
        {
            urls: ["<all_urls>"]
        }
    );
} else {
    console.warn(
        "webRequest API not available. Request tracking disabled."
    );
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(
        ["browsingData", "requestStats"],
        (result) => {
            chrome.storage.local.set({
                browsingData: result.browsingData || [],
                requestStats: result.requestStats || {}
            });
        }
    );

    console.log("EcoGuard installed");
});

chrome.runtime.onStartup.addListener(() => {
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        (tabs) => {
            if (tabs && tabs[0]) {
                activateTab(tabs[0].id);
            }
        }
    );
});

/*
    Auto-save every 10 seconds.
    This helps because MV3 service workers can sleep,
    and users may stay on one tab for a long time.
*/
setInterval(() => {
    saveCurrentVisit();
}, 10000);