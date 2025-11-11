(function() {
  'use strict';

  const spoofConfig = JSON.parse(document.documentElement.dataset.spoofConfig || '{}');
  
  if (!spoofConfig.enabled) return;

  const originalDefineProperty = Object.defineProperty;
  const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  function overrideProperty(obj, prop, descriptor) {
    try {
      originalDefineProperty(obj, prop, {
        ...descriptor,
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      console.warn('Failed to override property:', prop, e);
    }
  }

  if (spoofConfig.userAgent) {
    overrideProperty(Navigator.prototype, 'userAgent', {
      get: () => spoofConfig.userAgent
    });
  }

  if (spoofConfig.platform) {
    overrideProperty(Navigator.prototype, 'platform', {
      get: () => spoofConfig.platform
    });
  }

  if (spoofConfig.vendor) {
    overrideProperty(Navigator.prototype, 'vendor', {
      get: () => spoofConfig.vendor
    });
  }

  if (spoofConfig.language) {
    overrideProperty(Navigator.prototype, 'language', {
      get: () => spoofConfig.language
    });
    overrideProperty(Navigator.prototype, 'languages', {
      get: () => [spoofConfig.language, 'en-US', 'en']
    });
  }

  if (spoofConfig.screen) {
    const screenProps = ['width', 'height', 'availWidth', 'availHeight', 'colorDepth', 'pixelDepth'];
    screenProps.forEach(prop => {
      if (spoofConfig.screen[prop] !== undefined) {
        overrideProperty(Screen.prototype, prop, {
          get: () => spoofConfig.screen[prop]
        });
      }
    });
  }

  if (spoofConfig.timezone) {
    const OriginalDateTimeFormat = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function(...args) {
      const instance = new OriginalDateTimeFormat(...args);
      const originalResolvedOptions = instance.resolvedOptions;
      instance.resolvedOptions = function() {
        const options = originalResolvedOptions.call(this);
        options.timeZone = spoofConfig.timezone;
        return options;
      };
      return instance;
    };
    Intl.DateTimeFormat.prototype = OriginalDateTimeFormat.prototype;
  }

  if (spoofConfig.canvasSpoofing) {
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    const originalToBlob = HTMLCanvasElement.prototype.toBlob;
    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

    function addCanvasNoise(canvas) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const noise = Math.random() * 0.1;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + Math.random() * noise);
        data[i + 1] = Math.min(255, data[i + 1] + Math.random() * noise);
        data[i + 2] = Math.min(255, data[i + 2] + Math.random() * noise);
      }
      
      ctx.putImageData(imageData, 0, 0);
    }

    HTMLCanvasElement.prototype.toDataURL = function(...args) {
      addCanvasNoise(this);
      return originalToDataURL.apply(this, args);
    };

    HTMLCanvasElement.prototype.toBlob = function(...args) {
      addCanvasNoise(this);
      return originalToBlob.apply(this, args);
    };

    CanvasRenderingContext2D.prototype.getImageData = function(...args) {
      const imageData = originalGetImageData.apply(this, args);
      const data = imageData.data;
      const noise = Math.random() * 0.1;
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + Math.random() * noise);
        data[i + 1] = Math.min(255, data[i + 1] + Math.random() * noise);
        data[i + 2] = Math.min(255, data[i + 2] + Math.random() * noise);
      }
      
      return imageData;
    };
  }

  if (spoofConfig.webglSpoofing) {
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    const getParameterWebGL2 = WebGL2RenderingContext.prototype.getParameter;

    const spoofedParams = {
      37445: 'Intel Inc.',
      37446: 'Intel Iris OpenGL Engine',
      7936: 'WebKit',
      7937: 'WebKit WebGL',
      35724: 16,
      34076: 16384,
      34024: 16384,
      3379: 16384,
      36349: 1024,
      33902: [1, 8192],
      33901: [1, 8192]
    };

    function spoofGetParameter(param) {
      if (spoofedParams[param] !== undefined) {
        return spoofedParams[param];
      }
      return getParameter.call(this, param);
    }

    WebGLRenderingContext.prototype.getParameter = spoofGetParameter;
    WebGL2RenderingContext.prototype.getParameter = spoofGetParameter;
  }

  if (spoofConfig.hardwareConcurrency) {
    overrideProperty(Navigator.prototype, 'hardwareConcurrency', {
      get: () => spoofConfig.hardwareConcurrency
    });
  }

  if (spoofConfig.deviceMemory) {
    overrideProperty(Navigator.prototype, 'deviceMemory', {
      get: () => spoofConfig.deviceMemory
    });
  }

  document.documentElement.removeAttribute('data-spoof-config');
})();
