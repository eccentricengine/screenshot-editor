import { BaseTool, DrawingContext } from './base-tool';

export class CropTool extends BaseTool {
  name = 'crop';
  icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 2v4h4M18 2v4h-4M6 22v-4h4M18 22v-4h-4M2 6h4v4M22 6h-4v4M2 18h4v-4M22 18h-4v-4"/>
    <rect x="6" y="6" width="12" height="12" rx="1"/>
  </svg>`;

  private cropRect: { x: number; y: number; width: number; height: number } | null = null;

  onMouseDown(e: MouseEvent, context: DrawingContext): void {
    this.isDrawing = true;
    this.context = context;
    const coords = this.getCoordinates(e, context.canvas);
    context.startX = coords.x;
    context.startY = coords.y;
    context.currentX = coords.x;
    context.currentY = coords.y;
    this.cropRect = null;
  }

  onMouseMove(e: MouseEvent, context: DrawingContext): void {
    if (!this.isDrawing || !this.context) return;
    const coords = this.getCoordinates(e, context.canvas);
    context.currentX = coords.x;
    context.currentY = coords.y;
    this.drawCropPreview(context);
  }

  onMouseUp(_e: MouseEvent, context: DrawingContext): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.applyCrop(context);
  }

  onTouchStart(e: TouchEvent, context: DrawingContext): void {
    this.isDrawing = true;
    this.context = context;
    const coords = this.getCoordinates(e, context.canvas);
    context.startX = coords.x;
    context.startY = coords.y;
    context.currentX = coords.x;
    context.currentY = coords.y;
    this.cropRect = null;
  }

  onTouchMove(e: TouchEvent, context: DrawingContext): void {
    if (!this.isDrawing || !this.context) return;
    const coords = this.getCoordinates(e, context.canvas);
    context.currentX = coords.x;
    context.currentY = coords.y;
    this.drawCropPreview(context);
  }

  onTouchEnd(_e: TouchEvent, context: DrawingContext): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.applyCrop(context);
  }

  private updateCropRect(context: DrawingContext): void {
    const width = context.currentX - context.startX;
    const height = context.currentY - context.startY;
    this.cropRect = {
      x: Math.min(context.startX, context.currentX),
      y: Math.min(context.startY, context.currentY),
      width: Math.abs(width),
      height: Math.abs(height),
    };
  }

  private drawCropPreview(context: DrawingContext): void {
    this.updateCropRect(context);
    if (!this.cropRect || this.cropRect.width < 1 || this.cropRect.height < 1) {
      return;
    }

    // Just draw crop border without overlay
    context.ctx.save();
    context.ctx.strokeStyle = '#4a90e2';
    context.ctx.lineWidth = 2;
    context.ctx.setLineDash([5, 5]);
    context.ctx.strokeRect(this.cropRect.x, this.cropRect.y, this.cropRect.width, this.cropRect.height);
    context.ctx.restore();
  }

  private applyCrop(context: DrawingContext): void {
    if (!this.cropRect || this.cropRect.width < 10 || this.cropRect.height < 10) {
      this.cropRect = null;
      return;
    }

    const canvas = context.canvas;
    
    // Get the cropped image data
    const imageData = context.ctx.getImageData(
      this.cropRect.x,
      this.cropRect.y,
      this.cropRect.width,
      this.cropRect.height
    );

    // Create a temporary canvas to hold the cropped image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.cropRect.width;
    tempCanvas.height = this.cropRect.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      this.cropRect = null;
      return;
    }
    
    // Put the cropped image data on temp canvas
    tempCtx.putImageData(imageData, 0, 0);
    
    // Resize main canvas to crop size
    canvas.width = this.cropRect.width;
    canvas.height = this.cropRect.height;
    
    // Draw the cropped image on the main canvas
    context.ctx.clearRect(0, 0, canvas.width, canvas.height);
    context.ctx.drawImage(tempCanvas, 0, 0);
    
    this.cropRect = null;
  }
}

