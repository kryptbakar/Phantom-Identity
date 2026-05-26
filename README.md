# Phantom Identity - Privacy Browser Extension

A sophisticated Chrome extension that protects your privacy through intelligent fingerprint randomization and behavioral simulation.

## 🛡️ Features

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

## 📦 Project Structure

```
phantom-identity/
├── src/                      # Extension source code
│   ├── background.js         # Service worker
│   ├── content-script.js     # Content injection script
│   ├── injected-script.js    # Web-accessible script
│   ├── popup.js              # Popup script
│   ├── popup.html            # Dashboard UI
│   ├── popup.css             # Styling
│   ├── index.html            # Index page
│   └── manifest.json         # Extension manifest (Manifest V3)
├── public/
│   └── icons/                # Extension icons
├── tests/                    # Test files
│   ├── test.html
│   ├── test.js
│   └── verify-injection.html
├── docs/                     # Documentation
│   ├── INSTALLATION.md
│   ├── PROJECT_SUMMARY.md
│   └── README_OLD.md
├── assets/                   # Project assets
├── server.py                 # Development server
└── .gitignore               # Git ignore rules
```

## 🚀 Installation

### Chrome/Edge (Manifest V3)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/phantom-identity.git
   cd phantom-identity
   ```

2. Open Chrome/Edge and go to `chrome://extensions/`

3. Enable **Developer mode** (top right)

4. Click **Load unpacked**

5. Select the `src` folder from this project

6. The extension is now installed! Click the icon in your toolbar to open the dashboard

### Firefox (coming soon)

Firefox compatibility will require adapting the code to Manifest V2/MV3 Firefox standards.

## 📖 Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [Project Summary](docs/PROJECT_SUMMARY.md)
- [Original README](docs/README_OLD.md)

## 🔧 Development

### Requirements
- Chrome/Edge browser with extension support
- Modern JavaScript (ES6+)
- Optional: Python 3.x (for `server.py`)

### Local Testing

1. Make changes in the `src/` folder
2. Go to `chrome://extensions/`
3. Click **Reload** on the Phantom Identity extension
4. Test in the popup dashboard

## 🧪 Testing

Test files are located in the `tests/` directory:
- `test.html` - Manual testing interface
- `test.js` - Test utilities
- `verify-injection.html` - Injection verification tests

## 🔒 Privacy & Security

This extension:
- ✅ Works entirely offline
- ✅ Never collects user data
- ✅ No external API calls
- ✅ Open source for full transparency
- ✅ Randomizes fingerprints on every page load

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## ⚠️ Disclaimer

This tool is for privacy and research purposes. Users are responsible for ensuring their use complies with applicable laws and website terms of service.

---

**Built with ❤️ for privacy advocates**
