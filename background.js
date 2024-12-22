let tabMap = new Map();

browser.tabs.onCreated.addListener(async (tab) => {
  if (!tab.openerTabId) return;

  const parentTab = await browser.tabs.get(tab.openerTabId);

  tabMap.set(tab.id, {
    url: tab.url || 'Loading...',
    parentTabId: tab.openerTabId,
    parentTabTitle: parentTab.title
  });

  browser.tabs.sendMessage(tab.openerTabId, {
    type: 'SHOW_TOAST',
    tabId: tab.id,
    url: tab.url || 'Loading...'
  });
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!(changeInfo.url && tabMap.has(tabId))) return;

  const tabInfo = tabMap.get(tabId);

  browser.tabs.sendMessage(tabInfo.parentTabId, {
    type: 'UPDATE_TOAST',
    tabId: tabId,
    url: changeInfo.url
  });

  tabMap.set(tabId, { ...tabInfo, url: changeInfo.url });
});

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'SWITCH_TAB') {
    browser.tabs.update(message.tabId, { active: true });
  }
});