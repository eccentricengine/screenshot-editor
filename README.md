# 📸 Screenshot Editor

A powerful Stencil.js Web Component that allows users to take screenshots of any DOM portion and annotate them with a comprehensive image editor similar to Windows Paint.

## ✨ Features

- 🎯 **DOM Selection**: Semi-transparent overlay for selecting any portion of the page
- 🖌️ **Drawing Tools**:
  - Freehand drawing
  - Rectangle, Ellipse, Arrow, Line
  - Text tool with font size control
  - Crop tool
- 🎨 **Editor Features**:
  - Color picker
  - Brush size control
  - Undo/Redo functionality
  - Export to Blob/base64
- 📱 **Responsive & Touch-Friendly**: Works on desktop and mobile devices
- 🎪 **Flexible Integration**: Floating or inline button, or programmatic control

## 📦 Installation

```bash
npm install screenshot-editor
```

## 🚀 Quick Start

### Vanilla JavaScript - Method 1: Script Tag (CDN/Unpkg)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Screenshot Editor Demo</title>
</head>
<body>
  <h1>My Page</h1>
  <p>Click the button to take a screenshot!</p>
  
  <!-- Method 1: Using script tag with loader -->
  <script type="module">
    import { defineCustomElements } from 'https://unpkg.com/screenshot-editor@latest/loader/index.js';
    defineCustomElements();
  </script>
  
  <!-- Use the component -->
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

### Vanilla JavaScript - Method 2: ES Modules (Local)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Screenshot Editor Demo</title>
</head>
<body>
  <h1>My Page</h1>
  <p>Click the button to take a screenshot!</p>
  
  <!-- Method 2: Using ES modules from node_modules -->
  <script type="module">
    import { defineCustomElements } from './node_modules/screenshot-editor/loader/index.js';
    defineCustomElements();
  </script>
  
  <screenshot-editor
    button-label="Take Screenshot"
    button-position="bottom-right"
  ></screenshot-editor>

  <script type="module">
    const editor = document.querySelector('screenshot-editor');
    
    editor.addEventListener('editor-output', (e) => {
      const { blob, base64 } = e.detail;
      console.log('Exported image:', blob, base64);
    });
  </script>
</body>
</html>
```

### Vanilla JavaScript - Method 3: CommonJS (Node.js/Bundlers)

```javascript
// In your JavaScript file
const { defineCustomElements } = require('screenshot-editor/loader');

// Initialize the component
defineCustomElements();

// Use the component
const editor = document.querySelector('screenshot-editor');

editor.addEventListener('editor-output', (e) => {
  const { blob, base64 } = e.detail;
  console.log('Exported image:', blob, base64);
});
```

### Vanilla JavaScript - Method 4: Function-Based Triggering (No Button)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Screenshot Editor - Function Based</title>
</head>
<body>
  <h1>My Page</h1>
  <p>Click the button below to trigger screenshot!</p>
  
  <!-- Your custom button -->
  <button id="customScreenshotBtn">Take Screenshot</button>
  
  <!-- Component without button -->
  <screenshot-editor show-button="false"></screenshot-editor>

  <script type="module">
    import { defineCustomElements } from './node_modules/screenshot-editor/loader/index.js';
    defineCustomElements().then(() => {
      const editor = document.querySelector('screenshot-editor');
      
      // Function to trigger screenshot
      async function takeScreenshot() {
        try {
          await editor.startScreenshot();
        } catch (error) {
          console.error('Screenshot failed:', error);
        }
      }
      
      // Attach to your custom button
      document.getElementById('customScreenshotBtn').addEventListener('click', takeScreenshot);
      
      // Or call it programmatically
      // takeScreenshot();
      
      // Handle events
      editor.addEventListener('screenshot-selected', (e) => {
        console.log('Screenshot captured:', e.detail);
      });
      
      editor.addEventListener('editor-opened', () => {
        console.log('Editor opened');
      });
      
      editor.addEventListener('editor-output', (e) => {
        const { blob, base64 } = e.detail;
        console.log('Exported image:', blob, base64);
        
        // Example: Download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `screenshot-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
      
      editor.addEventListener('editor-closed', () => {
        console.log('Editor closed');
      });
    });
  </script>
</body>
</html>
```

### Vanilla JavaScript - Method 5: Open Editor with Existing Image

```html
<!DOCTYPE html>
<html>
<head>
  <title>Screenshot Editor - Open with Image</title>
</head>
<body>
  <h1>My Page</h1>
  <input type="file" id="imageInput" accept="image/*">
  <screenshot-editor show-button="false"></screenshot-editor>

  <script type="module">
    import { defineCustomElements } from './node_modules/screenshot-editor/loader/index.js';
    defineCustomElements().then(() => {
      const editor = document.querySelector('screenshot-editor');
      const fileInput = document.getElementById('imageInput');
      
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            await editor.openEditor(file);
          } catch (error) {
            console.error('Failed to open editor:', error);
          }
        }
      });
      
      editor.addEventListener('editor-output', (e) => {
        const { blob, base64 } = e.detail;
        console.log('Exported image:', blob, base64);
      });
    });
  </script>
</body>
</html>
```

## ⚛️ React Integration

### Installation

```bash
npm install screenshot-editor
```

### Usage

```jsx
import React, { useEffect, useRef } from 'react';
import { defineCustomElements } from 'screenshot-editor/loader';

function App() {
  const editorRef = useRef(null);

  useEffect(() => {
    // Initialize the component
    defineCustomElements();
  }, []);

  const handleScreenshot = async () => {
    if (editorRef.current) {
      await editorRef.current.startScreenshot();
    }
  };

  const handleEditorOutput = (e) => {
    const { blob, base64 } = e.detail;
    console.log('Exported image:', blob, base64);
    
    // Example: Upload to server
    const formData = new FormData();
    formData.append('image', blob, 'screenshot.png');
    fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
  };

  return (
    <div>
      <h1>My React App</h1>
      <button onClick={handleScreenshot}>Take Screenshot</button>
      
      <screenshot-editor
        ref={editorRef}
        show-button="false"
        onEditorOutput={handleEditorOutput}
      />
    </div>
  );
}

export default App;
```

### React with TypeScript

```tsx
import React, { useEffect, useRef } from 'react';
import { defineCustomElements } from 'screenshot-editor/loader';

// Type definition for the component
interface ScreenshotEditorElement extends HTMLElement {
  startScreenshot(): Promise<void>;
  openEditor(image: string | Blob): Promise<void>;
}

function App() {
  const editorRef = useRef<ScreenshotEditorElement>(null);

  useEffect(() => {
    defineCustomElements();
  }, []);

  const handleScreenshot = async () => {
    if (editorRef.current) {
      await editorRef.current.startScreenshot();
    }
  };

  const handleEditorOutput = (e: CustomEvent<{ blob: Blob; base64: string }>) => {
    const { blob, base64 } = e.detail;
    console.log('Exported image:', blob, base64);
  };

  return (
    <div>
      <h1>My React App</h1>
      <button onClick={handleScreenshot}>Take Screenshot</button>
      
      <screenshot-editor
        ref={editorRef}
        show-button="false"
        onEditorOutput={handleEditorOutput}
      />
    </div>
  );
}

export default App;
```

## 🖖 Vue Integration

### Installation

```bash
npm install screenshot-editor
```

### Usage (Vue 3)

```vue
<template>
  <div>
    <h1>My Vue App</h1>
    <button @click="takeScreenshot">Take Screenshot</button>
    
    <screenshot-editor
      ref="editor"
      :show-button="false"
      @editor-output="handleEditorOutput"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { defineCustomElements } from 'screenshot-editor/loader';

const editor = ref(null);

onMounted(() => {
  defineCustomElements();
});

const takeScreenshot = async () => {
  if (editor.value) {
    await editor.value.startScreenshot();
  }
};

const handleEditorOutput = (e) => {
  const { blob, base64 } = e.detail;
  console.log('Exported image:', blob, base64);
};
</script>
```

### Usage (Vue 2)

```vue
<template>
  <div>
    <h1>My Vue App</h1>
    <button @click="takeScreenshot">Take Screenshot</button>
    
    <screenshot-editor
      ref="editor"
      :show-button="false"
      @editor-output="handleEditorOutput"
    />
  </div>
</template>

<script>
import { defineCustomElements } from 'screenshot-editor/loader';

export default {
  name: 'App',
  mounted() {
    defineCustomElements();
  },
  methods: {
    async takeScreenshot() {
      if (this.$refs.editor) {
        await this.$refs.editor.startScreenshot();
      }
    },
    handleEditorOutput(e) {
      const { blob, base64 } = e.detail;
      console.log('Exported image:', blob, base64);
    }
  }
};
</script>
```

## 🅰️ Angular Integration

### Installation

```bash
npm install screenshot-editor
```

### Usage

```typescript
// app.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { defineCustomElements } from 'screenshot-editor/loader';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>My Angular App</h1>
      <button (click)="takeScreenshot()">Take Screenshot</button>
      
      <screenshot-editor
        #editor
        [show-button]="false"
        (editor-output)="handleEditorOutput($event)"
      ></screenshot-editor>
    </div>
  `
})
export class AppComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor!: ElementRef;

  ngOnInit() {
    defineCustomElements();
  }

  async takeScreenshot() {
    if (this.editor?.nativeElement) {
      await this.editor.nativeElement.startScreenshot();
    }
  }

  handleEditorOutput(e: CustomEvent<{ blob: Blob; base64: string }>) {
    const { blob, base64 } = e.detail;
    console.log('Exported image:', blob, base64);
  }
}
```

### Angular with CUSTOM_ELEMENTS_SCHEMA

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { defineCustomElements } from 'screenshot-editor/loader';
import { AppComponent } from './app.component';

defineCustomElements();

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
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

Fired when the user exports the edited image (via "Save and Exit" button).

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
2. **Rectangle** - Draw rectangles
3. **Ellipse** - Draw ellipses
4. **Arrow** - Draw arrows
5. **Line** - Draw straight lines
6. **Text** - Add text annotations (with font size control)
7. **Crop** - Crop the image

### Controls

- **Color Picker**: Select drawing color
- **Brush Size**: Adjust line/brush thickness (1-20px)
- **Font Size**: Control text size (8-72px) - visible when text tool is selected
- **Undo/Redo**: Navigate through edit history
- **Save and Exit**: Export the final edited image

## 📝 Complete Usage Examples

### Example 1: Basic Integration with Button

```html
<screenshot-editor
  button-label="Capture Screen"
  button-position="top-right"
></screenshot-editor>
```

### Example 2: Function-Based Triggering

```javascript
import { defineCustomElements } from 'screenshot-editor/loader';

defineCustomElements().then(() => {
  const editor = document.querySelector('screenshot-editor');
  editor.showButton = false; // Hide default button
  
  // Your custom trigger function
  function triggerScreenshot() {
    editor.startScreenshot();
  }
  
  // Attach to any element
  document.getElementById('myButton').addEventListener('click', triggerScreenshot);
  
  // Handle output
  editor.addEventListener('editor-output', (e) => {
    const { blob, base64 } = e.detail;
    // Use the image
    console.log('Image ready:', base64);
  });
});
```

### Example 3: Upload to Server

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

### Example 4: Open Editor with File Input

```html
<input type="file" id="fileInput" accept="image/*">
<screenshot-editor show-button="false"></screenshot-editor>

<script type="module">
  import { defineCustomElements } from 'screenshot-editor/loader';
  defineCustomElements().then(() => {
    const editor = document.querySelector('screenshot-editor');
    const fileInput = document.getElementById('fileInput');
    
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        await editor.openEditor(file);
      }
    });
  });
</script>
```

### Example 5: React Hook

```jsx
import { useEffect, useRef } from 'react';
import { defineCustomElements } from 'screenshot-editor/loader';

function useScreenshotEditor() {
  const editorRef = useRef(null);

  useEffect(() => {
    defineCustomElements();
  }, []);

  const takeScreenshot = async () => {
    if (editorRef.current) {
      await editorRef.current.startScreenshot();
    }
  };

  const openEditor = async (image) => {
    if (editorRef.current) {
      await editorRef.current.openEditor(image);
    }
  };

  return { editorRef, takeScreenshot, openEditor };
}

// Usage
function MyComponent() {
  const { editorRef, takeScreenshot } = useScreenshotEditor();

  return (
    <div>
      <button onClick={takeScreenshot}>Screenshot</button>
      <screenshot-editor ref={editorRef} show-button="false" />
    </div>
  );
}
```

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
    drawing-tools/         # Drawing tool implementations
    undo-redo.ts           # Undo/redo manager
```

## 🔧 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📦 Output Targets

The package supports multiple output formats:

- **ESM**: `dist/index.js`
- **CJS**: `dist/index.cjs.js`
- **Custom Elements**: `dist-custom-elements/`
- **Loader**: `loader/index.js`

## 🎯 Key Features

- ✅ Works inside Shadow DOM
- ✅ Full-page screenshot support (outside shadow root)
- ✅ Touch-friendly interface
- ✅ Responsive design
- ✅ Lightweight (no heavy dependencies like fabric.js)
- ✅ Modular architecture
- ✅ TypeScript support
- ✅ Fully typed API
- ✅ Framework agnostic (works with React, Vue, Angular, or vanilla JS)

## 🐛 Troubleshooting

### Screenshot not capturing correctly

Make sure the page content is fully loaded before triggering the screenshot. The component uses `html2canvas` which requires the DOM to be ready.

### Editor not opening

Check the browser console for errors. Ensure the component is properly loaded and the image data is valid.

### Touch events not working

Ensure `touch-action: none` is not being overridden by parent styles. The component handles this internally.

### Component not rendering in React/Vue/Angular

Make sure you've called `defineCustomElements()` before using the component. In React, call it in `useEffect`. In Vue, call it in `mounted()`. In Angular, call it in `ngOnInit()` or in the module.

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and feature requests, please use the GitHub issue tracker.

---

Made with ❤️ using Stencil.js
