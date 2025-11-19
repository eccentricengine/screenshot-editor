import { BaseTool, DrawingContext } from './base-tool';

export class RectangleTool extends BaseTool {
  name = 'rectangle';
  icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  </svg>`;

  onMouseDown(e: MouseEvent, context: DrawingContext): void {
    this.isDrawing = true;
    this.context = context;
    const coords = this.getCoordinates(e, context.canvas);
    context.startX = coords.x;
    context.startY = coords.y;
    context.currentX = coords.x;
    context.currentY = coords.y;
  }

  onMouseMove(e: MouseEvent, context: DrawingContext): void {
    if (!this.isDrawing || !this.context) return;
    const coords = this.getCoordinates(e, context.canvas);
    context.currentX = coords.x;
    context.currentY = coords.y;
    this.draw(context);
  }

  onMouseUp(_e: MouseEvent, context: DrawingContext): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.draw(context);
  }

  onTouchStart(e: TouchEvent, context: DrawingContext): void {
    this.isDrawing = true;
    this.context = context;
    const coords = this.getCoordinates(e, context.canvas);
    context.startX = coords.x;
    context.startY = coords.y;
    context.currentX = coords.x;
    context.currentY = coords.y;
  }

  onTouchMove(e: TouchEvent, context: DrawingContext): void {
    if (!this.isDrawing || !this.context) return;
    const coords = this.getCoordinates(e, context.canvas);
    context.currentX = coords.x;
    context.currentY = coords.y;
    this.draw(context);
  }

  onTouchEnd(_e: TouchEvent, context: DrawingContext): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.draw(context);
  }

  private draw(context: DrawingContext): void {
    const width = context.currentX - context.startX;
    const height = context.currentY - context.startY;
    const x = Math.min(context.startX, context.currentX);
    const y = Math.min(context.startY, context.currentY);
    const absWidth = Math.abs(width);
    const absHeight = Math.abs(height);

    context.ctx.save();
    context.ctx.globalAlpha = context.opacity;
    context.ctx.strokeStyle = context.color;
    context.ctx.lineWidth = context.brushSize;
    context.ctx.strokeRect(x, y, absWidth, absHeight);
    context.ctx.restore();
  }
}

