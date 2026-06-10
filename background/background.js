console.log("EcoGuard background service started");

let activeTabId=null, activeUrl=null, activeDomain=null, startTime=Date.now();
function getDomain(url){try{const u=new URL(url); if(!u.hostname||u.protocol.startsWith('chrome')||u.protocol.startsWith('edge')) return null; return u.hostname.replace(/^www\./,'');}catch{return null;}}
function nowISO(){return new Date().toISOString();}
function getLocal(key,fallback){return new Promise(r=>chrome.storage.local.get([key],res=>r(res[key]??fallback)));}
function setLocal(obj){return new Promise(r=>chrome.storage.local.set(obj,r));}
async function saveCurrentVisit(){if(!activeUrl||!activeDomain)return; const visitTime=Math.floor((Date.now()-startTime)/1000); if(visitTime<2)return; const browsingData=await getLocal('browsingData',[]); browsingData.push({domain:activeDomain,url:activeUrl,visitTime,timestamp:nowISO()}); await setLocal({browsingData:browsingData.slice(-500)});}
async function activateTab(tabId){await saveCurrentVisit(); activeTabId=tabId; startTime=Date.now(); chrome.tabs.get(tabId,tab=>{if(chrome.runtime.lastError||!tab||!tab.url)return; const domain=getDomain(tab.url); if(!domain)return; activeUrl=tab.url; activeDomain=domain;});}
chrome.tabs.onActivated.addListener(info=>activateTab(info.tabId));
chrome.tabs.onUpdated.addListener(async(tabId,changeInfo,tab)=>{if(tabId!==activeTabId)return; const nextUrl=changeInfo.url||tab.url; if(!nextUrl||nextUrl===activeUrl)return; const nextDomain=getDomain(nextUrl); if(!nextDomain)return; await saveCurrentVisit(); activeUrl=nextUrl; activeDomain=nextDomain; startTime=Date.now();});
chrome.windows.onFocusChanged.addListener(async windowId=>{if(windowId===chrome.windows.WINDOW_ID_NONE){await saveCurrentVisit(); activeTabId=null; activeUrl=null; activeDomain=null; return;} chrome.tabs.query({active:true,currentWindow:true},tabs=>{if(tabs&&tabs[0])activateTab(tabs[0].id);});});
chrome.webRequest.onCompleted.addListener(async details=>{const domain=getDomain(details.url); if(!domain)return; const requestStats=await getLocal('requestStats',{}); if(!requestStats[domain]) requestStats[domain]={requests:0,lastSeen:nowISO()}; requestStats[domain].requests+=1; requestStats[domain].lastSeen=nowISO(); await setLocal({requestStats});},{urls:['<all_urls>']});
chrome.runtime.onInstalled.addListener(()=>{chrome.storage.local.get(['browsingData','requestStats'],res=>chrome.storage.local.set({browsingData:res.browsingData||[],requestStats:res.requestStats||{}}));});
chrome.runtime.onStartup.addListener(()=>chrome.tabs.query({active:true,currentWindow:true},tabs=>{if(tabs&&tabs[0])activateTab(tabs[0].id);}));
