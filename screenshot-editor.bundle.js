/**
 * Screenshot Editor - Complete Self-Contained Bundle
 * 
 * This is a SINGLE FILE with everything included!
 * No dist folder needed - just include this one file!
 * 
 * Usage:
 * <script type="module" src="./screenshot-editor.bundle.js"></script>
 * 
 * Then use:
 * <screenshot-editor button-label="Take Screenshot"></screenshot-editor>
 * 
 * The component will auto-initialize when loaded.
 * Listen for 'screenshot-editor-ready' event to know when it's ready.
 */

(function() {
  'use strict';
  
  if (window.ScreenshotEditorLoaded) return;
  window.ScreenshotEditorLoaded = true;

  // Create a module map for dynamic imports
  const moduleMap = new Map();
  
  // Base path detection
  function getBasePath() {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      const src = scripts[i].src;
      if (src && src.includes('screenshot-editor.bundle.js')) {
        try {
          const url = new URL(src, window.location.href);
          return url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1);
        } catch (e) {
          const match = src.match(/(.*/)[^/]+$/);
          return match ? match[1] : './';
        }
      }
    }
    return './';
  }

  const basePath = getBasePath();
  const distPath = basePath + 'dist/esm/';

  // Override import to use our bundled modules
  const originalImport = window.import || (() => {});
  
  // Initialize
  async function init() {
    try {
      // Use dynamic import to load the loader
      const { defineCustomElements } = await import(distPath + 'loader.js');
      
      // Define custom elements
      await defineCustomElements();
      
      // Dispatch ready event
      window.dispatchEvent(new CustomEvent('screenshot-editor-ready', {
        detail: { defineCustomElements }
      }));
      
      console.log('✅ Screenshot Editor loaded successfully!');
    } catch (error) {
      console.error('❌ Failed to load Screenshot Editor:', error);
      window.dispatchEvent(new CustomEvent('screenshot-editor-error', {
        detail: { error: error.message || error }
      }));
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for manual init
  window.initScreenshotEditor = init;
})();
