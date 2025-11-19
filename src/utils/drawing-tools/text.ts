import { BaseTool, DrawingContext } from './base-tool';

export class TextTool extends BaseTool {
  name = 'text';
  icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="4 7 4 4 20 4 20 7"/>
    <line x1="9" y1="20" x2="15" y2="20"/>
    <line x1="12" y1="4" x2="12" y2="20"/>
  </svg>`;

  private textInput: HTMLTextAreaElement | null = null;
  private textContainer: HTMLDivElement | null = null;
  private textX: number = 0;
  private textY: number = 0;
  private currentContext: DrawingContext | null = null;
  private isSaving: boolean = false;

  onMouseDown(e: MouseEvent, context: DrawingContext): void {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove any existing text input first
    this.removeTextInput();
    
    const coords = this.getCoordinates(e, context.canvas);
    this.textX = coords.x;
    this.textY = coords.y;
    this.currentContext = context;
    this.showTextInput(context, coords.x, coords.y);
  }

  onMouseMove(_e: MouseEvent, _context: DrawingContext): void {
    // Text tool doesn't need move handling
  }

  onMouseUp(_e: MouseEvent, _context: DrawingContext): void {
    // Text tool handles input on mouse down
  }

  onTouchStart(e: TouchEvent, context: DrawingContext): void {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove any existing text input first
    this.removeTextInput();
    
    const coords = this.getCoordinates(e, context.canvas);
    this.textX = coords.x;
    this.textY = coords.y;
    this.currentContext = context;
    this.showTextInput(context, coords.x, coords.y);
  }

  onTouchMove(_e: TouchEvent, _context: DrawingContext): void {
    // Text tool doesn't need move handling
  }

  onTouchEnd(_e: TouchEvent, _context: DrawingContext): void {
    // Text tool handles input on touch start
  }

  private removeTextInput(): void {
    if (this.textContainer) {
      this.textContainer.remove();
      this.textContainer = null;
      this.textInput = null;
    } else if (this.textInput) {
      this.textInput.remove();
      this.textInput = null;
    }
  }

  private showTextInput(context: DrawingContext, x: number, y: number): void {
    const canvas = context.canvas;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Convert canvas coordinates to screen coordinates
    const screenX = rect.left + (x / scaleX);
    const screenY = rect.top + (y / scaleY);

    // Create container for textarea and button
    this.textContainer = document.createElement('div');
    this.textContainer.style.cssText = `
      position: fixed;
      left: ${screenX}px;
      top: ${screenY}px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    `;

    // Create textarea for multi-line support (like Paint)
    this.textInput = document.createElement('textarea');
    this.textInput.style.cssText = `
      border: 2px solid ${context.color};
      padding: 4px 8px;
      font-size: ${context.fontSize}px;
      color: ${context.color};
      background: rgba(255, 255, 255, 0.95);
      outline: none;
      font-family: Arial, sans-serif;
      min-width: 200px;
      min-height: ${context.fontSize + 10}px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      resize: both;
      overflow: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    `;
    this.textInput.placeholder = 'Type text...';

    // Create apply button with checkmark icon
    const applyButton = document.createElement('button');
    applyButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    applyButton.style.cssText = `
      background: #4a90e2;
      border: none;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: background 0.2s;
    `;
    applyButton.title = 'Apply text';
    applyButton.onmouseover = () => {
      applyButton.style.background = '#5aa0f2';
    };
    applyButton.onmouseout = () => {
      applyButton.style.background = '#4a90e2';
    };

    // Get reference to editor for saving state
    const canvasElement = context.canvas;
    const editor = (context as any).editor;
    
    const saveStateAndDraw = () => {
      // Prevent multiple saves
      if (this.isSaving) {
        return;
      }
      
      if (!this.textInput || !this.currentContext) {
        console.log('Text tool: Missing input or context', { hasInput: !!this.textInput, hasContext: !!this.currentContext });
        return;
      }
      
      this.isSaving = true;
      
      const text = this.textInput.value.trim();
      if (!text) {
        console.log('Text tool: Empty text, removing input');
        this.removeTextInput();
        this.isSaving = false;
        return;
      }
      
      console.log('Text tool: Drawing text', { text, x: this.textX, y: this.textY, context: !!this.currentContext.ctx });
      
      // Save state before drawing
      if (editor && editor.undoRedo) {
        editor.undoRedo.saveState(canvasElement);
      } else {
        // Fallback: try to find editor through shadow DOM
        const shadowRoot = canvasElement.getRootNode() as ShadowRoot;
        const editorElement = shadowRoot?.host as any;
        if (editorElement && editorElement.undoRedo) {
          editorElement.undoRedo.saveState(canvasElement);
        }
      }
      
      // Draw the text
      try {
        this.drawText(this.currentContext, text, this.textX, this.textY);
        console.log('Text tool: Text drawn successfully');
      } catch (error) {
        console.error('Text tool: Error drawing text', error);
      }
      
      this.removeTextInput();
      this.isSaving = false;
    };

    // Apply button click handler
    applyButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      saveStateAndDraw();
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to cancel
      if (e.key === 'Escape') {
        e.preventDefault();
        this.removeTextInput();
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      }
      // Ctrl+Enter to finish (Enter alone creates new line in textarea)
      else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        saveStateAndDraw();
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Don't save if clicking on toolbar buttons or other UI elements
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Don't save if clicking on the text container or its children
      if (this.textContainer && this.textContainer.contains(target)) {
        return;
      }
      
      // Check if click is on a button, input, or other UI element
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'INPUT' || 
          target.closest('button') || 
          target.closest('input') ||
          target.closest('.editor-toolbar') ||
          target.closest('.editor-header')) {
        // Don't save, just let blur handle it
        return;
      }
      
      if (this.textInput && !this.textInput.contains(target)) {
        // Only save if clicking on canvas or outside editor
        if (target.tagName === 'CANVAS' || !target.closest('image-editor')) {
          saveStateAndDraw();
          document.removeEventListener('mousedown', handleClickOutside);
        }
      }
    };

    // Add textarea and button to container
    this.textContainer.appendChild(this.textInput);
    this.textContainer.appendChild(applyButton);
    
    // Add container to body
    document.body.appendChild(this.textContainer);
    
    // Focus and select
    setTimeout(() => {
      if (this.textInput) {
        this.textInput.focus();
        this.textInput.select();
      }
    }, 10);

    // Event listeners - blur is fallback, button click is primary
    this.textInput.addEventListener('blur', () => {
      // Use a delay to allow button click to process first
      setTimeout(() => {
        // Only save on blur if button wasn't clicked and textarea still exists
        if (this.textInput && this.textContainer && document.body.contains(this.textContainer) && !this.isSaving) {
          // Check if blur was caused by clicking the apply button
          const activeElement = document.activeElement;
          if (activeElement !== applyButton && !this.textContainer.contains(activeElement as Node)) {
            console.log('Text tool: Blur event triggered - saving text');
            saveStateAndDraw();
          }
        }
      }, 150);
    });
    
    document.addEventListener('keydown', handleKeyDown);
    // Only use click outside for canvas clicks, not UI elements
    document.addEventListener('mousedown', handleClickOutside);
  }

  private drawText(context: DrawingContext, text: string, x: number, y: number): void {
    if (!context || !context.canvas) {
      console.error('Text tool: Invalid context', { hasContext: !!context, hasCanvas: !!context?.canvas });
      return;
    }
    
    // Get fresh canvas context
    const canvas = context.canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Text tool: Could not get 2d context');
      return;
    }
    
    console.log('Text tool: Drawing text on canvas', {
      text,
      x,
      y,
      color: context.color,
      fontSize: context.fontSize,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    });
    
    ctx.save();
    ctx.globalAlpha = 1; // Text always uses full opacity
    ctx.fillStyle = context.color;
    ctx.font = `${context.fontSize}px Arial`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    
    // Handle multi-line text
    const lines = text.split('\n');
    const lineHeight = context.fontSize * 1.2;
    
    lines.forEach((line, index) => {
      if (line) { // Draw even empty lines, just not whitespace-only
        const trimmedLine = line.trim();
        if (trimmedLine) {
          ctx.fillText(trimmedLine, x, y + (index * lineHeight));
          console.log(`Text tool: Drew line ${index}: "${trimmedLine}" at (${x}, ${y + (index * lineHeight)})`);
        }
      }
    });
    
    ctx.restore();
    
    console.log('Text tool: Text drawing complete');
  }
}

