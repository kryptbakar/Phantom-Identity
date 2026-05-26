# Phantom Identity - Privacy Browser Extension

A sophisticated browser extension that protects your privacy through intelligent fingerprint randomization and behavioral simulation.

## Features

### Fingerprint Spoofing
- **User-Agent & Platform Randomization**: Dynamically changes browser identification
- **Screen Resolution Spoofing**: Randomizes screen properties to prevent tracking
- **Timezone & Language Variation**: Creates geographical inconsistency
- **Canvas Fingerprint Protection**: Adds subtle noise to prevent Canvas-based tracking
- **WebGL Spoofing**: Randomizes GPU information queries
- **Hardware Specs Randomization**: Spoofs CPU cores and device memory

### Behavioral Simulation
- **Simulated Mouse Movements**: Natural cursor movement patterns
- **Automated Scroll Events**: Human-like scrolling behavior
- **Random Timing**: Realistic interaction delays

### Privacy Dashboard
- **Real-time Anonymity Score**: Visual feedback on protection effectiveness
- **Live Fingerprint Display**: See your current spoofed identity
- **Session Statistics**: Track fingerprint changes and behavioral events
- **Granular Controls**: Toggle individual protection features

## Installation

### Chrome/Edge (Manifest V3)

1. Clone or download this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `phantom-identity` folder
6. The extension icon should appear in your browser toolbar

### Firefox (WebExtensions)

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the extension folder
5. The extension will be active for the current session

## Usage

1. **Click the extension icon** to open the privacy dashboard
2. **View your anonymity score** - Higher is better (70+ = Good)
3. **Check current fingerprint** - Shows your spoofed identity
4. **Toggle protection features** - Enable/disable specific spoofing methods
5. **Test your protection** - Click "Test Fingerprint" to open the test page

## Testing Your Protection

### Built-in Test Pages

**Main Test Page** - Click "Test Fingerprint" in the popup to open a comprehensive test page that displays:
- Current navigator properties
- Screen information
- Canvas fingerprint hash
- WebGL information

**Injection Verification** - Open `verify-injection.html` to confirm API overrides execute before page scripts:
- Tests if User-Agent, Platform, Screen, and Canvas are properly spoofed
- Verifies timing of injected script execution
- Shows pass/fail status for each override

Reload the pages multiple times to verify randomization is working.

### External Testing Tools
- **[EFF Cover Your Tracks](https://coveryourtracks.eff.org/)** - Comprehensive fingerprinting test
- **[BrowserLeaks](https://browserleaks.com/)** - Detailed browser analysis
- **[AmIUnique](https://amiunique.org/)** - Browser uniqueness testing

## How It Works

### Injection Strategy
The extension uses a three-layer approach:

1. **Content Script** (`content-script.js`) - Injected into every page
2. **Injected Script** (`injected-script.js`) - Runs in page context before other scripts
3. **Background Worker** (`background.js`) - Manages settings and statistics

### API Interception
Before any tracking scripts load, the extension:
- Overrides `Navigator` properties using `Object.defineProperty`
- Intercepts Canvas and WebGL API calls
- Adds randomized noise to fingerprinting methods
- Simulates human behavior with DOM events

### Plausibility Engine
Values are randomized from a curated list of real device/OS combinations to ensure:
- Spoofed User-Agent matches expected screen resolution
- Platform-specific properties align correctly
- Hardware specs are realistic for the spoofed device

## Privacy Policy

**Phantom Identity is 100% local and private:**
- ✅ All processing happens in your browser
- ✅ No data is collected, stored, or transmitted
- ✅ No external servers or APIs
- ✅ No analytics or tracking
- ✅ Completely open source

## Configuration

### Default Settings
```javascript
{
  enabled: true,
  canvasSpoofing: true,
  webglSpoofing: true,
  behaviorSimulation: true
}
```

Settings are stored locally using Chrome's `storage.sync` API and persist across sessions.

## Development

### Project Structure
```
phantom-identity/
├── manifest.json           # Extension configuration
├── background.js           # Service worker
├── content-script.js       # Page injection logic
├── injected-script.js      # API interception
├── popup.html              # Dashboard UI
├── popup.css               # Dashboard styles
├── popup.js                # Dashboard logic
├── test.html               # Fingerprint test page
├── icons/                  # Extension icons
└── README.md               # Documentation
```

### Key Technical Considerations

**Canvas Spoofing**: Adds subtle pixel noise (0.1 max variance) to avoid obvious detection while changing the fingerprint hash.

**WebGL Spoofing**: Returns generic hardware information instead of real GPU details.

**Behavioral Simulation**: Uses `requestAnimationFrame` for smooth mouse movements and easing functions for natural scrolling.

## Limitations

- **Website Compatibility**: Some sites may behave unexpectedly with spoofed values
- **Detection Risk**: Advanced fingerprinting may detect the extension itself
- **Performance**: Minimal impact, but behavioral simulation uses CPU cycles
- **Manifest V3**: Background script cannot make network requests in MV3

## Ethical Use

This tool is designed for **legitimate privacy protection**. Please use responsibly:

✅ **Appropriate Uses**:
- Protecting personal privacy while browsing
- Testing your own websites for fingerprinting
- Security research and education
- Avoiding invasive tracking

❌ **Inappropriate Uses**:
- Circumventing security measures
- Fraudulent activities
- Terms of service violations
- Impersonation or deception

## Contributing

This is an open-source project. Contributions are welcome!

## License

MIT License - Free to use, modify, and distribute.

## Acknowledgments

Built following privacy-first principles inspired by:
- EFF Privacy Badger
- uBlock Origin
- Privacy research from academic institutions

---

**Stay Private. Stay Protected. Stay Phantom.** 👻
