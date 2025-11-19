# 📸 Screenshot Editor

A powerful web component for taking screenshots and annotating images with drawing tools. Works with any framework or vanilla JavaScript.

## ✨ Features

- 🎯 **DOM Selection**: Select any portion of the page to screenshot
- 🖌️ **Drawing Tools**: Freehand, Rectangle, Ellipse, Arrow, Line, Text, Crop
- 🎨 **Editor**: Color picker, brush size, undo/redo, export to Blob/base64
- 📱 **Responsive**: Works on desktop and mobile devices
- 🎪 **Framework Agnostic**: Works with React, Vue, Angular, or plain JavaScript

## 📦 Installation

```bash
npm install screenshot-editor
```

## 🚀 Usage

### Plain JavaScript / HTML

**Method 1: Standalone Script (Easiest)**

```html
<!DOCTYPE html>
<html>
<head>
  <script src="./node_modules/screenshot-editor/screenshot-editor.standalone.js"></script>
</head>
<body>
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
        // Use the image
      });
    });
  </script>
</body>
</html>
```

**Method 2: ES Modules**

```html
<script type="module">
  import { defineCustomElements } from './node_modules/screenshot-editor/loader/index.js';
  await defineCustomElements();
  
  const editor = document.querySelector('screenshot-editor');
  editor.addEventListener('editor-output', (e) => {
    console.log('Exported:', e.detail);
  });
</script>
```

**Global Functions (after standalone script loads):**

```javascript
// Start screenshot
window.startScreenshot();

// Open editor with image
window.openScreenshotEditor(imageBlob);

// Get editor instance
const editor = window.getScreenshotEditor();
```

---

### React

**Method 1: Using useEffect Hook**

```jsx
import React, { useEffect, useRef } from 'react';
import { defineCustomElements } from 'screenshot-editor/loader';

function App() {
  const editorRef = useRef(null);

  useEffect(() => {
    defineCustomElements();
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleExport = (e) => {
      const { blob, base64 } = e.detail;
      console.log('Exported:', blob);
      // Send to API or use as needed
    };

    editor.addEventListener('editor-output', handleExport);

    return () => {
      editor.removeEventListener('editor-output', handleExport);
    };
  }, []);

  return (
    <div>
      <screenshot-editor
        ref={editorRef}
        button-label="Take Screenshot"
        button-position="bottom-right"
        show-button={true}
      />
    </div>
  );
}

export default App;
```

**Method 2: Custom Hook**

```jsx
import { useEffect, useRef, useCallback } from 'react';
import { defineCustomElements } from 'screenshot-editor/loader';

function useScreenshotEditor(onExport) {
  const editorRef = useRef(null);

  useEffect(() => {
    defineCustomElements();
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleExport = (e) => onExport?.(e.detail);
    editor.addEventListener('editor-output', handleExport);

    return () => {
      editor.removeEventListener('editor-output', handleExport);
    };
  }, [onExport]);

  const startScreenshot = useCallback(async () => {
    if (editorRef.current) {
      await editorRef.current.startScreenshot();
    }
  }, []);

  return { editorRef, startScreenshot };
}

// Usage
function MyComponent() {
  const handleExport = ({ blob, base64 }) => {
    console.log('Exported:', blob);
  };

  const { editorRef, startScreenshot } = useScreenshotEditor(handleExport);

  return (
    <div>
      <button onClick={startScreenshot}>Take Screenshot</button>
      <screenshot-editor ref={editorRef} show-button={false} />
    </div>
  );
}
```

**TypeScript Support:**

```tsx
import React, { useEffect, useRef } from 'react';
import { defineCustomElements } from 'screenshot-editor/loader';

interface ScreenshotEditorElement extends HTMLElement {
  startScreenshot(): Promise<void>;
  openEditor(image: string | Blob): Promise<void>;
  buttonLabel: string;
  buttonPosition: string;
  showButton: boolean;
}

function App() {
  const editorRef = useRef<ScreenshotEditorElement>(null);

  useEffect(() => {
    defineCustomElements();
  }, []);

  return (
    <screenshot-editor
      ref={editorRef}
      button-label="Capture"
      button-position="bottom-right"
      show-button={true}
    />
  );
}
```

---

### Vue.js

**Vue 3 (Composition API)**

```vue
<template>
  <div>
    <screenshot-editor
      ref="editorRef"
      :button-label="'Take Screenshot'"
      :button-position="'bottom-right'"
      :show-button="true"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { defineCustomElements } from 'screenshot-editor/loader';

const editorRef = ref(null);

onMounted(async () => {
  await defineCustomElements();
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const editor = editorRef.value;
  if (editor) {
    editor.addEventListener('editor-output', handleExport);
  }
});

onUnmounted(() => {
  const editor = editorRef.value;
  if (editor) {
    editor.removeEventListener('editor-output', handleExport);
  }
});

const handleExport = (e) => {
  const { blob, base64 } = e.detail;
  console.log('Exported:', blob);
};
</script>
```

**Vue 2 (Options API)**

```vue
<template>
  <screenshot-editor
    ref="editor"
    :button-label="'Take Screenshot'"
    :button-position="'bottom-right'"
    :show-button="true"
  />
</template>

<script>
import { defineCustomElements } from 'screenshot-editor/loader';

export default {
  async mounted() {
    await defineCustomElements();
    
    this.$nextTick(() => {
      const editor = this.$refs.editor;
      if (editor) {
        editor.addEventListener('editor-output', this.handleExport);
      }
    });
  },
  beforeDestroy() {
    const editor = this.$refs.editor;
    if (editor) {
      editor.removeEventListener('editor-output', this.handleExport);
    }
  },
  methods: {
    handleExport(e) {
      const { blob, base64 } = e.detail;
      console.log('Exported:', blob);
    }
  }
};
</script>
```

---

### Angular

**Angular 12+ (Standalone Components)**

```typescript
import { Component, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { defineCustomElements } from 'screenshot-editor/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <screenshot-editor
      #editor
      [button-label]="'Take Screenshot'"
      [button-position]="'bottom-right'"
      [show-button]="true"
    ></screenshot-editor>
  `
})
export class AppComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor!: ElementRef;

  async ngOnInit() {
    await defineCustomElements();
  }

  ngAfterViewInit() {
    const editorElement = this.editor?.nativeElement;
    if (editorElement) {
      editorElement.addEventListener('editor-output', (e: CustomEvent) => {
        const { blob, base64 } = e.detail;
        console.log('Exported:', blob);
      });
    }
  }
}
```

**Angular Module-based**

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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// app.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <screenshot-editor
      #editor
      [button-label]="'Take Screenshot'"
      [button-position]="'bottom-right'"
      [show-button]="true"
    ></screenshot-editor>
  `
})
export class AppComponent implements AfterViewInit {
  @ViewChild('editor', { static: false }) editor!: ElementRef;

  ngAfterViewInit() {
    const editorElement = this.editor?.nativeElement;
    if (editorElement) {
      editorElement.addEventListener('editor-output', (e: CustomEvent) => {
        const { blob, base64 } = e.detail;
        console.log('Exported:', blob);
      });
    }
  }
}
```

---

### Svelte

```svelte
<script>
  import { onMount } from 'svelte';
  import { defineCustomElements } from 'screenshot-editor/loader';

  let editor;

  onMount(async () => {
    await defineCustomElements();
    
    editor = document.querySelector('screenshot-editor');
    if (editor) {
      editor.addEventListener('editor-output', (e) => {
        const { blob, base64 } = e.detail;
        console.log('Exported:', blob);
      });
    }
  });
</script>

<screenshot-editor
  bind:this={editor}
  button-label="Take Screenshot"
  button-position="bottom-right"
  show-button={true}
/>
```

---

## 📖 API Reference

### Component Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `button-label` | `string` | `"Take Screenshot"` | Button text |
| `button-position` | `string` | `"bottom-right"` | Position: `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"` |
| `show-button` | `boolean` | `true` | Show/hide floating button |

### Methods

#### `startScreenshot(): Promise<void>`

Start screenshot selection.

```javascript
const editor = document.querySelector('screenshot-editor');
await editor.startScreenshot();
```

#### `openEditor(image: string | Blob): Promise<void>`

Open editor with existing image.

```javascript
await editor.openEditor(imageBlob);
// or
await editor.openEditor('data:image/png;base64,...');
```

### Events

#### `screenshot-selected`

Fired when screenshot is captured.

```javascript
editor.addEventListener('screenshot-selected', (e) => {
  const blob = e.detail;
  console.log('Screenshot:', blob);
});
```

#### `editor-opened`

Fired when editor opens.

```javascript
editor.addEventListener('editor-opened', () => {
  console.log('Editor opened');
});
```

#### `editor-output`

Fired when image is exported.

```javascript
editor.addEventListener('editor-output', (e) => {
  const { blob, base64 } = e.detail;
  console.log('Exported:', blob, base64);
  
  // Example: Upload to server
  const formData = new FormData();
  formData.append('image', blob, 'screenshot.png');
  fetch('/api/upload', { method: 'POST', body: formData });
});
```

#### `editor-closed`

Fired when editor closes.

```javascript
editor.addEventListener('editor-closed', () => {
  console.log('Editor closed');
});
```

---

## 🎨 Editor Tools

- **Freehand** - Draw freehand lines
- **Rectangle** - Draw rectangles
- **Ellipse** - Draw ellipses
- **Arrow** - Draw arrows
- **Line** - Draw straight lines
- **Text** - Add text annotations (with font size control)
- **Crop** - Crop the image

### Controls

- **Color Picker** - Select drawing color
- **Brush Size** - Adjust thickness (1-20px)
- **Font Size** - For text tool (8-72px)
- **Undo/Redo** - Navigate edit history
- **Save and Exit** - Export the edited image

---

## 💡 Common Use Cases

### Upload to Server

```javascript
editor.addEventListener('editor-output', async (e) => {
  const { blob } = e.detail;
  
  const formData = new FormData();
  formData.append('image', blob, 'screenshot.png');
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  console.log('Uploaded:', result);
});
```

### Download Image

```javascript
editor.addEventListener('editor-output', (e) => {
  const { blob } = e.detail;
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `screenshot-${Date.now()}.png`;
  a.click();
  URL.revokeObjectURL(url);
});
```

### Open Existing Image

```javascript
// From file input
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    await editor.openEditor(file);
  }
});
```

---

## 🔧 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/eccentricengine/screenshot-editor/issues).

---

Made with ❤️ using Stencil.js
