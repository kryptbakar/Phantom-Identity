let currentFingerprint = null;
let fingerprintChanges = 0;
let behavioralEvents = 0;
let sessionStartTime = Date.now();

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: true,
    canvasSpoofing: true,
    webglSpoofing: true,
    behaviorSimulation: true,
    intensity: 'medium'
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updateFingerprint') {
    currentFingerprint = message.fingerprint;
    fingerprintChanges++;
    
    chrome.storage.local.set({
      currentFingerprint: currentFingerprint,
      fingerprintChanges: fingerprintChanges,
      lastUpdate: Date.now()
    });
  } else if (message.type === 'getStats') {
    const sessionDuration = (Date.now() - sessionStartTime) / 1000 / 60;
    const anonymityScore = calculateAnonymityScore(sessionDuration);
    
    sendResponse({
      fingerprint: currentFingerprint,
      fingerprintChanges: fingerprintChanges,
      behavioralEvents: behavioralEvents,
      anonymityScore: anonymityScore,
      sessionDuration: Math.floor(sessionDuration)
    });
  } else if (message.type === 'behavioralEvent') {
    behavioralEvents++;
    chrome.storage.local.set({ behavioralEvents: behavioralEvents });
  }
  
  return true;
});

function calculateAnonymityScore(sessionDurationMinutes) {
  let score = 0;
  
  const changesPerHour = sessionDurationMinutes > 0 ? (fingerprintChanges / sessionDurationMinutes) * 60 : 0;
  if (changesPerHour > 5) score += 30;
  else if (changesPerHour > 2) score += 20;
  else if (changesPerHour > 0) score += 10;
  
  const eventsPerMinute = sessionDurationMinutes > 0 ? behavioralEvents / sessionDurationMinutes : 0;
  if (eventsPerMinute > 2) score += 30;
  else if (eventsPerMinute > 1) score += 20;
  else if (eventsPerMinute > 0) score += 10;
  
  if (currentFingerprint) {
    if (currentFingerprint.canvasSpoofing) score += 20;
    if (currentFingerprint.webglSpoofing) score += 20;
  }
  
  return Math.min(100, score);
}

chrome.storage.local.get(['fingerprintChanges', 'behavioralEvents'], (result) => {
  if (result.fingerprintChanges) fingerprintChanges = result.fingerprintChanges;
  if (result.behavioralEvents) behavioralEvents = result.behavioralEvents;
});
