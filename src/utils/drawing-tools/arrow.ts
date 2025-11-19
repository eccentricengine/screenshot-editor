import { BaseTool, DrawingContext } from './base-tool';

export class ArrowTool extends BaseTool {
  name = 'arrow';
  icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
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
    const dx = context.currentX - context.startX;
    const dy = context.currentY - context.startY;
    const angle = Math.atan2(dy, dx);
    const arrowLength = 20;

    context.ctx.save();
    context.ctx.globalAlpha = context.opacity;
    context.ctx.strokeStyle = context.color;
    context.ctx.fillStyle = context.color;
    context.ctx.lineWidth = context.brushSize;
    context.ctx.lineCap = 'round';

    // Draw line
    context.ctx.beginPath();
    context.ctx.moveTo(context.startX, context.startY);
    context.ctx.lineTo(context.currentX, context.currentY);
    context.ctx.stroke();

    // Draw arrowhead
    context.ctx.beginPath();
    context.ctx.moveTo(context.currentX, context.currentY);
    context.ctx.lineTo(
      context.currentX - arrowLength * Math.cos(angle - Math.PI / 6),
      context.currentY - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    context.ctx.lineTo(
      context.currentX - arrowLength * Math.cos(angle + Math.PI / 6),
      context.currentY - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    context.ctx.closePath();
    context.ctx.fill();

    context.ctx.restore();
  }
}

