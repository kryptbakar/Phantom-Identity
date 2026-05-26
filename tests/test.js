'use strict';

let latestFingerprint = null;

document.addEventListener('DOMContentLoaded', initialize);

async function initialize() {
  const canvasButton = document.getElementById('canvasButton');
  if (canvasButton) {
    canvasButton.addEventListener('click', runCanvasTest);
  }

  await updateFingerprint();
}

async function updateFingerprint() {
  const fallback = snapshotNavigator();
  const spoofed = await requestSpoofedFingerprint();
  const source = spoofed || fallback;

  latestFingerprint = spoofed;

  setText('userAgent', source.userAgent || fallback.userAgent);
  setText('platform', source.platform || fallback.platform);
  setText('vendor', source.vendor ?? fallback.vendor ?? 'N/A');
  setText('language', source.language || fallback.language || 'N/A');

  const languages = normalizeLanguages(source);
  setText('languages', languages.length ? languages.join(', ') : 'N/A');

  setText('hardwareConcurrency', source.hardwareConcurrency ?? fallback.hardwareConcurrency ?? 'N/A');
  const deviceMemory = source.deviceMemory ?? fallback.deviceMemory;
  setText('deviceMemory', deviceMemory ? `${deviceMemory} GB` : 'N/A');

  if (source.screen) {
    setText('screenResolution', `${source.screen.width}x${source.screen.height}`);
    setText('availResolution', `${source.screen.availWidth}x${source.screen.availHeight}`);
    setText('colorDepth', `${source.screen.colorDepth} bit`);
    setText('pixelDepth', `${source.screen.pixelDepth} bit`);
  } else {
    setText('screenResolution', `${fallback.screen.width}x${fallback.screen.height}`);
    setText('availResolution', `${fallback.screen.availWidth}x${fallback.screen.availHeight}`);
    setText('colorDepth', `${fallback.screen.colorDepth} bit`);
    setText('pixelDepth', `${fallback.screen.pixelDepth} bit`);
  }

  setText('timezone', source.timezone || fallback.timezone || 'N/A');
  setText('timezoneOffset', `${source.timezoneOffset ?? fallback.timezoneOffset} minutes`);

  runCanvasTest();
  runWebGLTest();
}

function snapshotNavigator() {
  const fallbackLanguages = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages.slice()
    : (navigator.language ? [navigator.language] : []);

  let timezone = 'N/A';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'N/A';
  } catch (error) {
    timezone = 'N/A';
  }

  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    vendor: navigator.vendor,
    language: navigator.language,
    languages: fallbackLanguages,
    hardwareConcurrency: navigator.hardwareConcurrency ?? null,
    deviceMemory: navigator.deviceMemory ?? null,
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    },
    timezone,
    timezoneOffset: new Date().getTimezoneOffset()
  };
}

function normalizeLanguages(source) {
  if (Array.isArray(source.languages) && source.languages.length > 0) {
    return source.languages;
  }
  if (typeof source.language === 'string' && source.language.trim()) {
    return [source.language];
  }
  return [];
}

async function requestSpoofedFingerprint() {
  if (!window.chrome || !chrome.runtime || !chrome.runtime.id) {
    return null;
  }

  return new Promise(resolve => {
    try {
      chrome.runtime.sendMessage({ type: 'generateTestFingerprint' }, response => {
        if (chrome.runtime.lastError) {
          resolve(null);
          return;
        }
        resolve(response && response.fingerprint ? response.fingerprint : null);
      });
    } catch (error) {
      resolve(null);
    }
  });
}

function runCanvasTest() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#667eea';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Arial';
  ctx.fillText('Phantom Identity Test', 10, 30);

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(180, 25, 15, 0, Math.PI * 2);
  ctx.fill();

  if (latestFingerprint?.canvasSpoofing) {
    applySimulatedCanvasNoise(ctx, canvas.width, canvas.height);
  }

  try {
    const dataURL = canvas.toDataURL();
    const hash = hashCode(dataURL);
    setText('canvasHash', hash);
  } catch (error) {
    setText('canvasHash', 'Unavailable');
  }
}

function applySimulatedCanvasNoise(ctx, width, height) {
  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const noiseLevel = 0.6 + Math.random() * 0.4;

    for (let i = 0; i < data.length; i += 4) {
      const variation = (Math.random() - 0.5) * noiseLevel;
      data[i] = clampColor(data[i] + variation * 255);
      data[i + 1] = clampColor(data[i + 1] + variation * 255);
      data[i + 2] = clampColor(data[i + 2] + variation * 255);
    }

    ctx.putImageData(imageData, 0, 0);
  } catch (error) {
    // ignore noise failures
  }
}

function clampColor(value) {
  return Math.max(0, Math.min(255, value));
}

function runWebGLTest() {
  if (latestFingerprint?.webglSpoofing) {
    setText('webglVendor', latestFingerprint.webglVendor || 'Spoofed Vendor');
    setText('webglRenderer', latestFingerprint.webglRenderer || 'Spoofed Renderer');
    return;
  }

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      setText('webglVendor', gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
      setText('webglRenderer', gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
    } else {
      setText('webglVendor', gl.getParameter(gl.VENDOR));
      setText('webglRenderer', gl.getParameter(gl.RENDERER));
    }
  } else {
    setText('webglVendor', 'WebGL not supported');
    setText('webglRenderer', 'WebGL not supported');
  }
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(16);
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value ?? 'N/A';
  }
}
