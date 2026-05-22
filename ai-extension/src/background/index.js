console.log('AI Assistant Service Worker Initialized');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Demo for potential background logic
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PING') {
    sendResponse({ type: 'PONG' });
  }
  return true;
});
