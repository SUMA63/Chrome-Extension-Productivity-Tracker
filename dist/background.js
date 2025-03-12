
// Track active tab and time spent
let activeTabData = {
  id: null,
  url: null,
  domain: null,
  startTime: null
};

let blockedSites = [];

// Load blocked sites from storage on startup
chrome.storage.local.get(['blockedSites'], (result) => {
  if (result.blockedSites) {
    blockedSites = result.blockedSites;
    updateBlockRules();
  }
});

// Get domain from URL
function getDomainFromUrl(url) {
  try {
    const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    return domain;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return url;
  }
}

// Update active tab when it changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // Save data for previous tab
  if (activeTabData.id && activeTabData.startTime) {
    const timeSpent = (new Date().getTime() - activeTabData.startTime) / 1000;
    if (timeSpent > 1 && activeTabData.domain) { // Only log if more than 1 second was spent
      logWebsiteVisit(activeTabData.domain, activeTabData.url, timeSpent);
    }
  }

  // Get info about the new active tab
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.url.startsWith('http')) {
      activeTabData = {
        id: tab.id,
        url: tab.url,
        domain: getDomainFromUrl(tab.url),
        startTime: new Date().getTime()
      };
    } else {
      // Reset if not a web page
      activeTabData = { id: null, url: null, domain: null, startTime: null };
    }
  } catch (error) {
    console.error('Error getting tab info:', error);
  }
});

// Track when a tab's URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tabId === activeTabData.id) {
    // Save data for previous URL
    if (activeTabData.startTime) {
      const timeSpent = (new Date().getTime() - activeTabData.startTime) / 1000;
      if (timeSpent > 1 && activeTabData.domain) {
        logWebsiteVisit(activeTabData.domain, activeTabData.url, timeSpent);
      }
    }
    
    // Update with new URL
    activeTabData = {
      id: tab.id,
      url: tab.url,
      domain: getDomainFromUrl(tab.url),
      startTime: new Date().getTime()
    };
  }
});

// Log website visit to storage
function logWebsiteVisit(domain, url, timeSpent) {
  chrome.storage.local.get(['websiteData'], (result) => {
    let websiteData = result.websiteData || [];
    
    // Check if domain exists in data
    const existingIndex = websiteData.findIndex(site => site.url.includes(domain));
    
    if (existingIndex >= 0) {
      // Update existing entry
      websiteData[existingIndex].timeSpent += timeSpent;
      websiteData[existingIndex].visits += 1;
      websiteData[existingIndex].lastVisit = new Date().toISOString();
    } else {
      // Create new entry
      websiteData.push({
        id: Date.now(),
        url: domain,
        name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
        favicon: `https://${domain}/favicon.ico`,
        category: 'Neutral', // Default category
        timeSpent: timeSpent,
        visits: 1,
        lastVisit: new Date().toISOString()
      });
    }
    
    // Save updated data
    chrome.storage.local.set({ websiteData });
  });
}

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getWebsiteData') {
    chrome.storage.local.get(['websiteData'], (result) => {
      sendResponse({ data: result.websiteData || [] });
    });
    return true; // Required for async sendResponse
  }
  
  if (message.action === 'getBlockedSites') {
    chrome.storage.local.get(['blockedSites'], (result) => {
      sendResponse({ data: result.blockedSites || [] });
    });
    return true;
  }
  
  if (message.action === 'updateBlockedSites') {
    blockedSites = message.sites;
    chrome.storage.local.set({ blockedSites });
    updateBlockRules();
    sendResponse({ success: true });
    return true;
  }
});

// Update blocking rules based on blockedSites
function updateBlockRules() {
  const rules = blockedSites
    .filter(site => site.active)
    .map((site, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: 'block' },
      condition: {
        urlFilter: site.domain,
        resourceTypes: ['main_frame']
      }
    }));

  // Clear existing rules and add new ones
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [...Array(blockedSites.length + 1).keys()].slice(1),
    addRules: rules
  });
}
