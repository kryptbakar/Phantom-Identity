let updateInterval;

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await updateStats();
  
  updateInterval = setInterval(updateStats, 2000);
  
  document.getElementById('enabledToggle').addEventListener('change', saveSettings);
  document.getElementById('canvasToggle').addEventListener('change', saveSettings);
  document.getElementById('webglToggle').addEventListener('change', saveSettings);
  document.getElementById('behaviorToggle').addEventListener('change', saveSettings);
  document.getElementById('testButton').addEventListener('click', openTestPage);
});

async function loadSettings() {
  const settings = await chrome.storage.sync.get({
    enabled: true,
    canvasSpoofing: true,
    webglSpoofing: true,
    behaviorSimulation: true
  });
  
  document.getElementById('enabledToggle').checked = settings.enabled;
  document.getElementById('canvasToggle').checked = settings.canvasSpoofing;
  document.getElementById('webglToggle').checked = settings.webglSpoofing;
  document.getElementById('behaviorToggle').checked = settings.behaviorSimulation;
}

async function saveSettings() {
  const settings = {
    enabled: document.getElementById('enabledToggle').checked,
    canvasSpoofing: document.getElementById('canvasToggle').checked,
    webglSpoofing: document.getElementById('webglToggle').checked,
    behaviorSimulation: document.getElementById('behaviorToggle').checked
  };
  
  await chrome.storage.sync.set(settings);
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    chrome.tabs.reload(tab.id);
  }
}

async function updateStats() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'getStats' });
    
    if (response) {
      document.getElementById('scoreValue').textContent = response.anonymityScore;
      updateScoreCircle(response.anonymityScore);
      
      document.getElementById('fingerprintChanges').textContent = response.fingerprintChanges;
      document.getElementById('sessionDuration').textContent = `${response.sessionDuration} min`;
      document.getElementById('behavioralEvents').textContent = response.behavioralEvents;
      
      if (response.fingerprint) {
        const fp = response.fingerprint;
        document.getElementById('userAgent').textContent = fp.userAgent || 'N/A';
        document.getElementById('platform').textContent = fp.platform || 'N/A';
        document.getElementById('screen').textContent = fp.screen 
          ? `${fp.screen.width}x${fp.screen.height}` 
          : 'N/A';
        document.getElementById('timezone').textContent = fp.timezone || 'N/A';
        document.getElementById('language').textContent = fp.language || 'N/A';
      }
    }
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

function updateScoreCircle(score) {
  const circle = document.getElementById('scoreCircle');
  const circumference = 283;
  const offset = circumference - (score / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  
  if (score >= 70) {
    circle.style.stroke = '#4ade80';
  } else if (score >= 40) {
    circle.style.stroke = '#fbbf24';
  } else {
    circle.style.stroke = '#f87171';
  }
}

function openTestPage() {
  chrome.tabs.create({ url: 'test.html' });
}
