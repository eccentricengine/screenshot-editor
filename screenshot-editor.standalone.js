/**
 * Screenshot Editor - Standalone Bundle
 * 
 * Include this file in your HTML <head> or before closing </body>
 * 
 * Usage:
 * <script src="./screenshot-editor.standalone.js"></script>
 * 
 * Then use the component:
 * <screenshot-editor button-label="Take Screenshot"></screenshot-editor>
 * 
 * The component will auto-initialize when the page loads.
 * Listen for 'screenshot-editor-ready' event to know when it's ready.
 */

(function() {
  'use strict';
  
  // Check if already loaded
  if (window.ScreenshotEditorLoaded) {
    return;
  }
  window.ScreenshotEditorLoaded = true;

  // Get the base path from the script src or detect npm package
  function getScriptBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      const src = scripts[i].src;
      if (src && (src.includes('screenshot-editor.standalone.js') || src.includes('screenshot-editor'))) {
        try {
          const url = new URL(src, window.location.href);
          let path = url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1);
          
          // If from node_modules, adjust path
          if (path.includes('node_modules/screenshot-editor')) {
            path = path.substring(0, path.indexOf('node_modules/screenshot-editor') + 'node_modules/screenshot-editor'.length) + '/';
          }
          
          return path;
        } catch (e) {
          // Fallback for older browsers
          const match = src.match(/(.*\/)[^\/]+$/);
          return match ? match[1] : './';
        }
      }
    }
    // Default to current directory
    return './';
  }

  const basePath = getScriptBasePath();
  
  // Auto-initialize function
  async function initializeScreenshotEditor() {
    try {
      // Try npm package path first, then fallback to local
      let loaderPath = basePath + 'dist/esm/loader.js';
      
      // If basePath doesn't end with /, add it
      if (!basePath.endsWith('/')) {
        loaderPath = basePath + '/dist/esm/loader.js';
      }
      
      // Check if dynamic import is supported (modern browsers)
      if (typeof window !== 'undefined' && 'noModule' in HTMLScriptElement.prototype) {
        // Use dynamic import for modern browsers
        const { defineCustomElements } = await import(loaderPath);
        await defineCustomElements();
        
        // Dispatch custom event when ready
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('screenshot-editor-ready', {
            detail: { defineCustomElements }
          }));
        }
        
        console.log('✅ Screenshot Editor loaded successfully!');
      } else {
        // Fallback: Load via script tag for older browsers
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = basePath + 'dist/cjs/loader.cjs.js';
          script.onload = () => {
            if (window.defineCustomElements) {
              window.defineCustomElements().then(() => {
                window.dispatchEvent(new CustomEvent('screenshot-editor-ready'));
                console.log('✅ Screenshot Editor loaded successfully!');
                resolve();
              }).catch(reject);
            } else {
              reject(new Error('defineCustomElements not found'));
            }
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    } catch (error) {
      console.error('❌ Failed to load Screenshot Editor:', error);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('screenshot-editor-error', {
          detail: { error: error.message || error }
        }));
      }
    }
  }

  // Initialize when DOM is ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeScreenshotEditor);
    } else {
      // DOM already ready
      initializeScreenshotEditor();
    }
  }

  // Export global functions for programmatic control
  if (typeof window !== 'undefined') {
    window.initScreenshotEditor = initializeScreenshotEditor;
    
    // Global function to start screenshot
    window.startScreenshot = async function() {
      const editor = document.querySelector('screenshot-editor');
      if (editor && editor.startScreenshot) {
        await editor.startScreenshot();
      } else {
        console.warn('Screenshot Editor not ready yet. Wait for screenshot-editor-ready event.');
      }
    };
    
    // Global function to open editor with image
    window.openScreenshotEditor = async function(image) {
      const editor = document.querySelector('screenshot-editor');
      if (editor && editor.openEditor) {
        await editor.openEditor(image);
      } else {
        console.warn('Screenshot Editor not ready yet. Wait for screenshot-editor-ready event.');
      }
    };
    
    // Global function to get editor instance
    window.getScreenshotEditor = function() {
      return document.querySelector('screenshot-editor');
    };
  }
})();

