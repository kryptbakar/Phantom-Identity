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
  } else if (message.type === 'generateTestFingerprint') {
    generateSpoofConfigForTest().then(fingerprint => {
      sendResponse({ fingerprint });
    }).catch(error => {
      console.error('Failed to generate test fingerprint:', error);
      sendResponse({ fingerprint: null, error: true });
    });
    return true;
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

async function generateSpoofConfigForTest() {
  const settings = await chrome.storage.sync.get({
    enabled: true,
    canvasSpoofing: true,
    webglSpoofing: true,
    behaviorSimulation: true
  });

  if (!settings.enabled) {
    return null;
  }

  const profiles = [
    {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'Win32',
      vendor: 'Google Inc.',
      screen: { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040, colorDepth: 24, pixelDepth: 24 },
      hardwareConcurrency: 8,
      deviceMemory: 8
    },
    {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'MacIntel',
      vendor: 'Google Inc.',
      screen: { width: 2560, height: 1440, availWidth: 2560, availHeight: 1415, colorDepth: 24, pixelDepth: 24 },
      hardwareConcurrency: 4,
      deviceMemory: 8
    },
    {
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'Linux x86_64',
      vendor: 'Google Inc.',
      screen: { width: 1920, height: 1080, availWidth: 1920, availHeight: 1040, colorDepth: 24, pixelDepth: 24 },
      hardwareConcurrency: 6,
      deviceMemory: 4
    },
    {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      platform: 'Win32',
      vendor: '',
      screen: { width: 1366, height: 768, availWidth: 1366, availHeight: 728, colorDepth: 24, pixelDepth: 24 },
      hardwareConcurrency: 4,
      deviceMemory: 4
    }
  ];

  const timezones = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const languages = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'ja-JP'];
  const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
  const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
  const randomTimezone = timezones[Math.floor(Math.random() * timezones.length)];

  return {
    userAgent: randomProfile.userAgent,
    platform: randomProfile.platform,
    vendor: randomProfile.vendor,
    language: randomLanguage,
    languages: [randomLanguage, randomLanguage.split('-')[0]].filter(Boolean),
    screen: randomProfile.screen,
    timezone: randomTimezone,
    hardwareConcurrency: randomProfile.hardwareConcurrency,
    deviceMemory: randomProfile.deviceMemory,
    canvasSpoofing: settings.canvasSpoofing,
    webglSpoofing: settings.webglSpoofing,
    webglVendor: settings.webglSpoofing ? 'Intel Inc.' : null,
    webglRenderer: settings.webglSpoofing ? 'Intel Iris OpenGL Engine' : null
  };
}
