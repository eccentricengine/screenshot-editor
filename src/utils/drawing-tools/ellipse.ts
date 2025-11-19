import { BaseTool, DrawingContext } from './base-tool';

export class EllipseTool extends BaseTool {
  name = 'ellipse';
  icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <ellipse cx="12" cy="12" rx="9" ry="6"/>
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
    const centerX = (context.startX + context.currentX) / 2;
    const centerY = (context.startY + context.currentY) / 2;
    const radiusX = Math.abs(width) / 2;
    const radiusY = Math.abs(height) / 2;

    context.ctx.save();
    context.ctx.globalAlpha = context.opacity;
    context.ctx.strokeStyle = context.color;
    context.ctx.lineWidth = context.brushSize;
    context.ctx.beginPath();
    context.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    context.ctx.stroke();
    context.ctx.restore();
  }
}

