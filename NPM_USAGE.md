# 📦 NPM Installation & Usage

## Installation

```bash
npm install screenshot-editor
```

## Usage Methods

### Method 1: Standalone Script (Easiest)

Copy the standalone file to your public folder:

```bash
cp node_modules/screenshot-editor/screenshot-editor.standalone.js ./public/
cp -r node_modules/screenshot-editor/dist ./public/
```

Then in your HTML:

```html
<script src="./screenshot-editor.standalone.js"></script>
<screenshot-editor button-label="Take Screenshot"></screenshot-editor>
```

### Method 2: Import in JavaScript

```javascript
import { defineCustomElements } from 'screenshot-editor/loader';

// Initialize
await defineCustomElements();

// Use the component
const editor = document.querySelector('screenshot-editor');
editor.addEventListener('editor-output', (e) => {
  const { blob, base64 } = e.detail;
  console.log('Exported:', blob);
});
```

### Method 3: Require (CommonJS)

```javascript
const { defineCustomElements } = require('screenshot-editor/loader');

defineCustomElements().then(() => {
  const editor = document.querySelector('screenshot-editor');
  // Use editor...
});
```

### Method 4: Direct Import

```javascript
import 'screenshot-editor/standalone';
// Component auto-initializes
```

## Global Functions

After including the standalone script, these global functions are available:

```javascript
// Start screenshot
window.startScreenshot();

// Open editor with image
window.openScreenshotEditor(imageBlob);

// Get editor instance
const editor = window.getScreenshotEditor();
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <script src="./node_modules/screenshot-editor/screenshot-editor.standalone.js"></script>
</head>
<body>
  <h1>My Website</h1>
  
  <screenshot-editor
    button-label="Take Screenshot"
    button-position="bottom-right"
    show-button="true"
  ></screenshot-editor>
  
  <script>
    window.addEventListener('screenshot-editor-ready', () => {
      const editor = window.getScreenshotEditor();
      
      editor.addEventListener('editor-output', (e) => {
        const { blob, base64 } = e.detail;
        console.log('Exported:', blob);
        // Send to your API
      });
    });
  </script>
</body>
</html>
```

## For Build Tools (Webpack, Vite, etc.)

The package works with all modern build tools. Just import:

```javascript
import 'screenshot-editor/loader';
// or
import { defineCustomElements } from 'screenshot-editor/loader';
```

## File Structure After Install

```
node_modules/screenshot-editor/
├── dist/                          # Component files
├── loader/                        # Loader files
├── screenshot-editor.standalone.js # Standalone loader
├── package.json
└── README.md
```

---

**That's it! Simple and clean integration.** 🎉

