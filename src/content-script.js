(async function() {
  'use strict';

  const settings = await chrome.storage.sync.get({
    enabled: true,
    canvasSpoofing: true,
    webglSpoofing: true,
    behaviorSimulation: true
  });

  if (!settings.enabled) return;

  const spoofConfig = await generateSpoofConfig();
  
  const inlineScript = document.createElement('script');
  inlineScript.textContent = `window.__PHANTOM_SPOOF_CONFIG__ = ${JSON.stringify(spoofConfig)};`;
  (document.head || document.documentElement).appendChild(inlineScript);
  inlineScript.remove();
  
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected-script.js');
  (document.head || document.documentElement).appendChild(script);
  script.onload = () => script.remove();

  async function generateSpoofConfig() {
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
    
    return {
      enabled: settings.enabled,
      userAgent: randomProfile.userAgent,
      platform: randomProfile.platform,
      vendor: randomProfile.vendor,
      language: languages[Math.floor(Math.random() * languages.length)],
      screen: randomProfile.screen,
      timezone: timezones[Math.floor(Math.random() * timezones.length)],
      hardwareConcurrency: randomProfile.hardwareConcurrency,
      deviceMemory: randomProfile.deviceMemory,
      canvasSpoofing: settings.canvasSpoofing,
      webglSpoofing: settings.webglSpoofing
    };
  }

  if (settings.behaviorSimulation) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      simulateHumanBehavior();
    } else {
      document.addEventListener('DOMContentLoaded', simulateHumanBehavior, { once: true });
    }
  }

  function simulateHumanBehavior() {
    const randomDelay = (min, max) => Math.random() * (max - min) + min;

    setTimeout(() => {
      if (!document.body) return;

      const scrollAmount = Math.random() * 0.4 * document.body.scrollHeight;
      const scrollDuration = randomDelay(1000, 3000);
      const startTime = Date.now();
      const startScroll = window.scrollY;

      function smoothScroll() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        const easeProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        window.scrollTo(0, startScroll + scrollAmount * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(smoothScroll);
        }
      }

      recordBehaviorEvent();
      smoothScroll();
    }, randomDelay(5000, 15000));

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    function simulateMouseMovement() {
      const targetX = Math.random() * window.innerWidth;
      const targetY = Math.random() * window.innerHeight;
      const steps = 20 + Math.random() * 30;

      recordBehaviorEvent();

      for (let i = 0; i < steps; i++) {
        setTimeout(() => {
          mouseX += (targetX - mouseX) * 0.1;
          mouseY += (targetY - mouseY) * 0.1;

          const event = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: mouseX,
            clientY: mouseY
          });

          document.elementFromPoint(mouseX, mouseY)?.dispatchEvent(event);
        }, i * 50);
      }

      setTimeout(simulateMouseMovement, randomDelay(10000, 30000));
    }

    setTimeout(simulateMouseMovement, randomDelay(3000, 8000));
  }

  function recordBehaviorEvent() {
    try {
      chrome.runtime.sendMessage({ type: 'behavioralEvent' }, () => {
        // Silence potential "receiving end does not exist" errors when popup/background unavailable.
        void chrome.runtime.lastError;
      });
    } catch (error) {
      // No-op: messaging can fail if the extension context is unloading.
    }
  }

  chrome.runtime.sendMessage({ 
    type: 'updateFingerprint', 
    fingerprint: spoofConfig 
  });
})();
