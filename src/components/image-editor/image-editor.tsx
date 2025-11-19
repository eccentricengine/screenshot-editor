import { Component, Element, Event, EventEmitter, Method, State, h } from '@stencil/core';
import { BaseTool } from '../../utils/drawing-tools/base-tool';
import { FreehandTool } from '../../utils/drawing-tools/freehand';
import { RectangleTool } from '../../utils/drawing-tools/rectangle';
import { EllipseTool } from '../../utils/drawing-tools/ellipse';
import { ArrowTool } from '../../utils/drawing-tools/arrow';
import { LineTool } from '../../utils/drawing-tools/line';
import { TextTool } from '../../utils/drawing-tools/text';
import { CropTool } from '../../utils/drawing-tools/crop';
import { UndoRedoManager } from '../../utils/undo-redo';
import { DrawingContext } from '../../utils/drawing-tools/base-tool';

@Component({
  tag: 'image-editor',
  styleUrl: 'image-editor.css',
  shadow: true,
})
export class ImageEditor {
  @Element() el!: HTMLElement;
  @Event() editorOutput!: EventEmitter<{ blob: Blob; base64: string }>;
  @Event() editorClosed!: EventEmitter<void>;

  @State() currentTool!: BaseTool;
  @State() currentColor: string = '#000000';
  @State() brushSize: number = 3;
  @State() opacity: number = 1;
  @State() fontSize: number = 16;
  @State() imageLoaded: boolean = false;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private image!: HTMLImageElement;
  private tools: Map<string, BaseTool> = new Map();
  private undoRedo: UndoRedoManager = new UndoRedoManager();
  private drawingContext!: DrawingContext;
  private isDrawing: boolean = false;
  private snapshotImageData: ImageData | null = null;

  componentDidLoad() {
    this.initializeTools();
    // Wait for canvas to be in DOM
    setTimeout(() => {
      this.setupCanvas();
    }, 0);
  }

  private initializeTools() {
    this.tools.set('freehand', new FreehandTool());
    this.tools.set('rectangle', new RectangleTool());
    this.tools.set('ellipse', new EllipseTool());
    this.tools.set('arrow', new ArrowTool());
    this.tools.set('line', new LineTool());
    this.tools.set('text', new TextTool());
    this.tools.set('crop', new CropTool());
    const freehandTool = this.tools.get('freehand');
    if (freehandTool) {
      this.currentTool = freehandTool;
    }
  }

  private setupCanvas() {
    const canvas = this.el.shadowRoot?.querySelector('canvas');
    if (!canvas) {
      console.warn('Canvas element not found, retrying...');
      // Retry after a short delay
      setTimeout(() => {
        this.setupCanvas();
      }, 50);
      return;
    }
    this.canvas = canvas;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2d context');
    }
    this.ctx = ctx;
    this.drawingContext = {
      canvas: this.canvas,
      ctx: this.ctx,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      color: this.currentColor,
      brushSize: this.brushSize,
      opacity: this.opacity,
      fontSize: this.fontSize,
    };

    this.attachEventListeners();
  }

  @Method()
  async loadImage(imageSrc: string | Blob): Promise<void> {
    // Ensure canvas is initialized - wait for it if needed
    if (!this.canvas) {
      await this.waitForCanvas();
    }

    // Wait a bit to ensure canvas is ready
    await new Promise(resolve => setTimeout(resolve, 100));

    return new Promise<void>((resolve, reject) => {
      this.image = new Image();
      this.image.onload = () => {
        if (!this.canvas || !this.ctx) {
          console.error('Canvas not initialized when trying to load image');
          reject(new Error('Canvas not initialized'));
          return;
        }
        
        console.log('Image loaded:', this.image.width, 'x', this.image.height);
        
        // Set canvas dimensions
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        
        // Clear and draw the image
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0);
        
        console.log('Canvas updated:', this.canvas.width, 'x', this.canvas.height);
        
        this.imageLoaded = true;
        this.undoRedo.clear();
        this.undoRedo.saveState(this.canvas);
        
        resolve();
      };
      this.image.onerror = (error) => {
        console.error('Failed to load image:', error);
        reject(new Error('Failed to load image'));
      };

      if (typeof imageSrc === 'string') {
        this.image.src = imageSrc;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            this.image.src = e.target.result as string;
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(imageSrc);
      }
    });
  }

  private attachEventListeners() {
    if (!this.canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (!this.currentTool || !this.imageLoaded) return;
      
      // For text tool, don't set isDrawing or save state here
      // Text tool will save state when text is actually drawn
      if (this.currentTool.name !== 'text') {
        this.isDrawing = true;
        this.undoRedo.saveState(this.canvas);
        // Save snapshot for preview tools
        this.snapshotImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      }
      
      this.updateDrawingContext();
      // Pass reference to this component for text tool to access undoRedo
      (this.drawingContext as any).editor = this;
      this.currentTool.onMouseDown(e, this.drawingContext);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!this.isDrawing || !this.currentTool || !this.imageLoaded) return;
      // Restore snapshot for preview tools (shapes, arrow, line)
      if (this.snapshotImageData && this.needsPreviewRestore(this.currentTool)) {
        this.ctx.putImageData(this.snapshotImageData, 0, 0);
      }
      this.updateDrawingContext();
      this.currentTool.onMouseMove(e, this.drawingContext);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      if (this.currentTool && this.imageLoaded) {
        this.updateDrawingContext();
        this.currentTool.onMouseUp(e, this.drawingContext);
      }
      this.snapshotImageData = null;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!this.currentTool || !this.imageLoaded) return;
      e.preventDefault();
      
      // For text tool, don't set isDrawing or save state here
      if (this.currentTool.name !== 'text') {
        this.isDrawing = true;
        this.undoRedo.saveState(this.canvas);
        // Save snapshot for preview tools
        this.snapshotImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      }
      
      this.updateDrawingContext();
      // Pass reference to this component for text tool to access undoRedo
      (this.drawingContext as any).editor = this;
      this.currentTool.onTouchStart(e, this.drawingContext);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!this.isDrawing || !this.currentTool || !this.imageLoaded) return;
      e.preventDefault();
      // Restore snapshot for preview tools (shapes, arrow, line)
      if (this.snapshotImageData && this.needsPreviewRestore(this.currentTool)) {
        this.ctx.putImageData(this.snapshotImageData, 0, 0);
      }
      this.updateDrawingContext();
      this.currentTool.onTouchMove(e, this.drawingContext);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!this.isDrawing) return;
      e.preventDefault();
      this.isDrawing = false;
      if (this.currentTool && this.imageLoaded) {
        this.updateDrawingContext();
        this.currentTool.onTouchEnd(e, this.drawingContext);
      }
      this.snapshotImageData = null;
    };

    this.canvas.addEventListener('mousedown', handleMouseDown);
    this.canvas.addEventListener('mousemove', handleMouseMove);
    this.canvas.addEventListener('mouseup', handleMouseUp);
    this.canvas.addEventListener('touchstart', handleTouchStart);
    this.canvas.addEventListener('touchmove', handleTouchMove);
    this.canvas.addEventListener('touchend', handleTouchEnd);
  }

  private updateDrawingContext() {
    this.drawingContext.color = this.currentColor;
    this.drawingContext.brushSize = this.brushSize;
    this.drawingContext.opacity = this.opacity;
    this.drawingContext.fontSize = this.fontSize;
    // Always pass editor reference for tools that need it (like text tool)
    (this.drawingContext as any).editor = this;
  }

  private async waitForCanvas(maxAttempts: number = 50): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const checkCanvas = () => {
        attempts++;
        const canvas = this.el.shadowRoot?.querySelector('canvas');
        if (canvas) {
          this.setupCanvas();
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Canvas element did not appear in time'));
        } else {
          setTimeout(checkCanvas, 50);
        }
      };
      checkCanvas();
    });
  }

  private needsPreviewRestore(tool: BaseTool): boolean {
    const previewTools = ['rectangle', 'ellipse', 'arrow', 'line', 'crop'];
    return previewTools.includes(tool.name);
  }

  selectTool(toolName: string) {
    const tool = this.tools.get(toolName);
    if (tool) {
      this.currentTool = tool;
    }
  }

  handleUndo() {
    if (this.undoRedo.undo(this.canvas)) {
      // State updated
    }
  }

  handleRedo() {
    if (this.undoRedo.redo(this.canvas)) {
      // State updated
    }
  }

  handleColorChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.currentColor = input.value;
  }

  handleBrushSizeChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.brushSize = parseInt(input.value, 10);
  }

  handleOpacityChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.opacity = parseFloat(input.value);
  }

  handleFontSizeChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.fontSize = parseInt(input.value, 10);
  }

  async exportImage() {
    return new Promise<{ blob: Blob; base64: string }>((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob from canvas'));
          return;
        }
        const base64 = this.canvas.toDataURL('image/png');
        console.log('Exported image (base64):', base64);
        const result = { blob, base64 };
        this.editorOutput.emit(result);
        resolve(result);
      }, 'image/png', 1.0);
    });
  }

  handleClose() {
    this.editorClosed.emit();
  }

  async handleSaveAndExit() {
    await this.exportImage();
    this.handleClose();
  }

  render() {
    return (
      <div class="editor-container">
        <div class="editor-header">
          <h3>Image Editor</h3>
          <button class="close-btn" onClick={() => this.handleClose()}>
            ×
          </button>
        </div>
        <div class="editor-toolbar">
          <div class="tool-group">
            {Array.from(this.tools.entries()).map(([name, tool]) => (
              <button
                class={`tool-btn ${this.currentTool && this.currentTool === tool ? 'active' : ''}`}
                onClick={() => this.selectTool(name)}
                title={name}
                innerHTML={tool.icon}
              />
            ))}
          </div>
          <div class="tool-group">
            <label class="color-picker-label">
              <input
                type="color"
                value={this.currentColor}
                onInput={(e) => this.handleColorChange(e)}
                class="color-picker"
              />
            </label>
            <label class="slider-label">
              Size:
              <input
                type="range"
                min="1"
                max="20"
                value={this.brushSize}
                onInput={(e) => this.handleBrushSizeChange(e)}
                class="slider"
              />
              <span>{this.brushSize}</span>
            </label>
            {this.currentTool && this.currentTool.name === 'text' && (
              <label class="slider-label">
                Font Size:
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={this.fontSize}
                  onInput={(e) => this.handleFontSizeChange(e)}
                  class="slider"
                />
                <span>{this.fontSize}px</span>
              </label>
            )}
          </div>
          <div class="tool-group">
            <button
              class="tool-btn"
              onClick={() => this.handleUndo()}
              title="Undo"
              disabled={!this.undoRedo.canUndo()}
            >
              ↶
            </button>
            <button
              class="tool-btn"
              onClick={() => this.handleRedo()}
              title="Redo"
              disabled={!this.undoRedo.canRedo()}
            >
              ↷
            </button>
            <button class="export-btn" onClick={() => this.handleSaveAndExit()} title="Save and Exit">
              Save and Exit
            </button>
          </div>
        </div>
        <div class="editor-canvas-container">
          <canvas></canvas>
        </div>
      </div>
    );
  }
}

