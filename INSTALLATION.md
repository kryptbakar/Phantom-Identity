# Phantom Identity - Installation Instructions

## Quick Start Guide

### For Chrome / Edge / Brave (Recommended)

1. **Download the Extension Files**
   - All the extension files are in this directory
   - No build step required - it's ready to use!

2. **Open Extensions Management Page**
   - Open Chrome/Edge/Brave
   - Navigate to: `chrome://extensions/`
   - Or click the puzzle icon → "Manage Extensions"

3. **Enable Developer Mode**
   - Find the toggle in the top-right corner
   - Turn ON "Developer mode"

4. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to this project folder
   - Select the entire folder (containing manifest.json)
   - Click "Select Folder"

5. **Verify Installation**
   - You should see "Phantom Identity" in your extensions list
   - The extension icon should appear in your browser toolbar
   - Click the icon to open the privacy dashboard

### For Firefox

1. **Open Firefox Debugging Page**
   - Navigate to: `about:debugging#/runtime/this-firefox`

2. **Load Temporary Add-on**
   - Click "Load Temporary Add-on..."
   - Navigate to this project folder
   - Select the `manifest.json` file
   - Click "Open"

3. **Note for Firefox Users**
   - The extension will remain active only for the current session
   - You'll need to reload it each time you restart Firefox
   - For permanent installation, the extension would need to be signed by Mozilla

## Testing Your Installation

### Built-in Test Page

1. Click the Phantom Identity extension icon
2. Click "Test Fingerprint" button at the bottom
3. A new tab will open showing your current fingerprint
4. Reload the page multiple times to verify randomization is working
5. The Canvas Hash should change on each reload

### External Testing Tools

Test your privacy protection with these trusted tools:

- **EFF Cover Your Tracks**: https://coveryourtracks.eff.org/
  - Comprehensive fingerprinting test
  - Shows if your browser is unique

- **BrowserLeaks**: https://browserleaks.com/
  - Detailed analysis of browser properties
  - Tests Canvas, WebGL, fonts, and more

- **AmIUnique**: https://amiunique.org/
  - Checks browser uniqueness
  - Compares against their database

## Using the Extension

### Privacy Dashboard

Click the extension icon to see:
- **Anonymity Score** (0-100): Higher is better
  - 70+ = Good protection
  - 40-69 = Moderate protection
  - Below 40 = Limited protection

- **Current Fingerprint**: Your spoofed browser identity

- **Session Statistics**:
  - Fingerprint Changes: How many times your identity changed
  - Session Duration: How long the extension has been active
  - Behavioral Events: Simulated mouse/scroll actions

### Protection Controls

Toggle individual features on/off:
- **Enable Protection**: Master switch for all features
- **Canvas Spoofing**: Randomizes Canvas fingerprints
- **WebGL Spoofing**: Randomizes GPU information
- **Behavior Simulation**: Simulates human-like interactions

Changes take effect after reloading the current page.

## Verifying It's Working

### Method 1: Canvas Hash Test
1. Open the test page (click "Test Fingerprint" in popup)
2. Note the Canvas Hash value
3. Reload the page (F5 or Ctrl+R)
4. The Canvas Hash should be different
5. Repeat several times - each hash should be unique

### Method 2: EFF Cover Your Tracks
1. Visit https://coveryourtracks.eff.org/
2. Click "Test Your Browser"
3. After first test, note your fingerprint
4. Close and reopen the test page
5. Your fingerprint should be different

### Method 3: Check Navigator Properties
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `navigator.userAgent`
4. Reload the page
5. Type again - it may have changed

## Troubleshooting

### Extension Not Loading
- Make sure Developer Mode is enabled
- Check that you selected the correct folder (contains manifest.json)
- Look for error messages in the extensions page

### Fingerprint Not Changing
- Ensure "Enable Protection" toggle is ON
- Reload the page after changing settings
- Check browser console for errors (F12 → Console)

### Dashboard Not Showing Data
- Visit a few web pages first to generate data
- Wait a few seconds for statistics to update
- Dashboard refreshes every 2 seconds automatically

### Website Not Working Correctly
- Some sites may not work well with spoofed values
- Try disabling specific features (Canvas/WebGL) for that site
- You can temporarily turn off protection for specific sites

## File Structure

```
phantom-identity/
├── manifest.json           # Extension configuration ⚙️
├── background.js           # Background service worker
├── content-script.js       # Page injection logic
├── injected-script.js      # API interception
├── popup.html              # Dashboard interface
├── popup.css               # Dashboard styling
├── popup.js                # Dashboard logic
├── test.html               # Test page
├── icons/                  # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md               # Full documentation
├── INSTALLATION.md         # This file
└── server.py               # Demo web server
```

## Privacy & Security

✅ **What Phantom Identity Does:**
- Randomizes your browser fingerprint
- Simulates natural browsing behavior
- Processes everything locally

❌ **What Phantom Identity Does NOT Do:**
- Collect any data about you
- Send information to external servers
- Replace a VPN or secure your connection
- Guarantee 100% anonymity

## Next Steps

1. **Test It**: Use the built-in test page and external tools
2. **Customize**: Adjust settings to your preferences
3. **Browse Normally**: The extension works automatically
4. **Monitor Score**: Check your anonymity score periodically

## Getting Help

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Try disabling other privacy extensions temporarily
3. Test in a fresh browser profile
4. Review the full documentation in README.md

## Uninstalling

### Chrome/Edge/Brave
1. Go to `chrome://extensions/`
2. Find "Phantom Identity"
3. Click "Remove"
4. Confirm removal

### Firefox
1. Go to `about:addons`
2. Find "Phantom Identity"
3. Click "Remove"

---

**Enjoy your enhanced privacy! 👻**
