# 📸 Screenshot Editor

A powerful Stencil.js Web Component that allows users to take screenshots of any DOM portion and annotate them with a comprehensive image editor similar to Windows Paint.

## ✨ Features

- 🎯 **DOM Selection**: Semi-transparent overlay for selecting any portion of the page
- 🖌️ **Drawing Tools**:
  - Freehand drawing
  - Highlighter pen with opacity control
  - Text tool
  - Basic Shapes: Rectangle, Ellipse, Arrow, Line
  - Crop tool
- 🎨 **Editor Features**:
  - Color picker
  - Brush size control
  - Opacity control
  - Undo/Redo functionality
  - Export to Blob/base64
- 📱 **Responsive & Touch-Friendly**: Works on desktop and mobile devices
- 🎪 **Flexible Integration**: Floating or inline button, or programmatic control

## 📦 Installation

```bash
npm install screenshot-editor
```

## 🚀 Quick Start (NPM)

After installing, you have 3 easy options:

### Option 1: Standalone Script (Easiest)

Copy files to your public folder:
```bash
cp node_modules/screenshot-editor/screenshot-editor.standalone.js ./public/
cp -r node_modules/screenshot-editor/dist ./public/
```

Include in HTML:
```html
<script src="./screenshot-editor.standalone.js"></script>
<screenshot-editor button-label="Take Screenshot"></screenshot-editor>
```

### Option 2: Import in JavaScript

```javascript
import { defineCustomElements } from 'screenshot-editor/loader';
await defineCustomElements();
```

### Option 3: Direct Import

```javascript
import 'screenshot-editor/standalone';
// Auto-initializes!
```

**See [NPM_USAGE.md](./NPM_USAGE.md) for detailed npm usage.**

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="./node_modules/screenshot-editor/dist/screenshot-editor/screenshot-editor.esm.js"></script>
</head>
<body>
  <!-- Your content here -->
  
  <screenshot-editor
    button-label="Take Screenshot"
    button-position="bottom-right"
    show-button="true"
  ></screenshot-editor>

  <script>
    const editor = document.querySelector('screenshot-editor');
    
    editor.addEventListener('editor-output', (e) => {
      const { blob, base64 } = e.detail;
      console.log('Exported image:', blob, base64);
      // Use the image as needed
    });
  </script>
</body>
</html>
```

### Using with Module Bundlers

```javascript
import { defineCustomElements } from 'screenshot-editor/loader';

defineCustomElements();

// Use the component
const editor = document.querySelector('screenshot-editor');
```

## 📖 API Reference

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttonLabel` | `string` | `"Take Screenshot"` | Text displayed on the trigger button |
| `buttonPosition` | `string` | `"bottom-right"` | Floating button position: `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"` |
| `showButton` | `boolean` | `true` | Whether to show the floating button |

### Methods

#### `startScreenshot(): Promise<void>`

Starts the screenshot selection process. Opens the overlay for the user to select a region.

```javascript
const editor = document.querySelector('screenshot-editor');
await editor.startScreenshot();
```

#### `openEditor(image: string | Blob): Promise<void>`

Opens the editor with an existing image (Blob or data URL).

```javascript
const editor = document.querySelector('screenshot-editor');
await editor.openEditor(imageBlob);
// or
await editor.openEditor('data:image/png;base64,...');
```

### Events

#### `screenshot-selected`

Fired when a screenshot is captured (before opening the editor).

```javascript
editor.addEventListener('screenshot-selected', (e) => {
  const blob = e.detail; // Blob object
  console.log('Screenshot captured:', blob);
});
```

#### `editor-opened`

Fired when the editor is opened.

```javascript
editor.addEventListener('editor-opened', () => {
  console.log('Editor is now open');
});
```

#### `editor-output`

Fired when the user exports the edited image.

```javascript
editor.addEventListener('editor-output', (e) => {
  const { blob, base64 } = e.detail;
  console.log('Exported image:', blob, base64);
  
  // Example: Download the image
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'screenshot.png';
  a.click();
  URL.revokeObjectURL(url);
});
```

#### `editor-closed`

Fired when the editor is closed.

```javascript
editor.addEventListener('editor-closed', () => {
  console.log('Editor closed');
});
```

## 🎨 Editor Tools

### Drawing Tools

1. **Freehand** - Draw freehand lines
2. **Highlighter** - Semi-transparent highlighting tool
3. **Rectangle** - Draw rectangles
4. **Ellipse** - Draw ellipses
5. **Arrow** - Draw arrows
6. **Line** - Draw straight lines
7. **Text** - Add text annotations
8. **Crop** - Crop the image

### Controls

- **Color Picker**: Select drawing color
- **Brush Size**: Adjust line/brush thickness (1-20px)
- **Opacity**: Control transparency (0-100%)
- **Undo/Redo**: Navigate through edit history
- **Export**: Export the final edited image

## 🛠️ Development

### Build

```bash
npm run build
```

### Development Server

```bash
npm start
```

This will start a development server with hot-reload at `http://localhost:3333`.

### Project Structure

```
src/
  components/
    screenshot-editor/     # Main component
    image-editor/          # Image editor component
  utils/
    screen-selector.ts     # DOM selection overlay
    html2canvas.ts         # Screenshot capture utility
    drawing-tools/          # Drawing tool implementations
    undo-redo.ts           # Undo/redo manager
```

## 🚀 Quick Integration

**See [INTEGRATION.md](./INTEGRATION.md) for simple step-by-step instructions.**

Quick start:
1. Copy `screenshot-editor.standalone.js` and `dist/` folder
2. Include `<script src="./screenshot-editor.standalone.js"></script>`
3. Add `<screenshot-editor></screenshot-editor>` tag
4. Done!

## 📝 Usage Examples

### Example 1: Basic Integration

```html
<screenshot-editor></screenshot-editor>
```

### Example 2: Custom Button Position

```html
<screenshot-editor
  button-position="top-left"
  button-label="Capture Screen"
></screenshot-editor>
```

### Example 3: Programmatic Control (No Button)

```html
<screenshot-editor show-button="false"></screenshot-editor>

<script>
  const editor = document.querySelector('screenshot-editor');
  
  // Trigger screenshot from your own button
  document.getElementById('myButton').addEventListener('click', () => {
    editor.startScreenshot();
  });
</script>
```

### Example 4: Handle Export and Download

```javascript
const editor = document.querySelector('screenshot-editor');

editor.addEventListener('editor-output', (e) => {
  const { blob } = e.detail;
  
  // Download the image
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `screenshot-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
```

### Example 5: Upload to Server

```javascript
editor.addEventListener('editor-output', async (e) => {
  const { blob } = e.detail;
  
  const formData = new FormData();
  formData.append('image', blob, 'screenshot.png');
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    console.log('Uploaded:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
});
```

## 🔧 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Output Targets

The package supports multiple output formats:

- **ESM**: `dist/screenshot-editor/screenshot-editor.esm.js`
- **CJS**: `dist/index.cjs.js`
- **Custom Elements**: `dist-custom-elements/`

## 🎯 Key Features

- ✅ Works inside Shadow DOM
- ✅ Full-page screenshot support (outside shadow root)
- ✅ Touch-friendly interface
- ✅ Responsive design
- ✅ Lightweight (no heavy dependencies like fabric.js)
- ✅ Modular architecture
- ✅ TypeScript support
- ✅ Fully typed API

## 🐛 Troubleshooting

### Screenshot not capturing correctly

Make sure the page content is fully loaded before triggering the screenshot. The component uses `html2canvas` which requires the DOM to be ready.

### Editor not opening

Check the browser console for errors. Ensure the component is properly loaded and the image data is valid.

### Touch events not working

Ensure `touch-action: none` is not being overridden by parent styles. The component handles this internally.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and feature requests, please use the GitHub issue tracker.

---

Made with ❤️ using Stencil.js

