import { BaseTool, DrawingContext } from './base-tool';

export class HighlighterTool extends BaseTool {
  name = 'highlighter';
  icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 12l4-4 4 4 4-4 4 4M3 20h18"/>
  </svg>`;

  private path: { x: number; y: number }[] = [];

  onMouseDown(e: MouseEvent, context: DrawingContext): void {
    this.isDrawing = true;
    this.context = context;
    const coords = this.getCoordinates(e, context.canvas);
    this.path = [{ x: coords.x, y: coords.y }];
    context.startX = coords.x;
    context.startY = coords.y;
    context.currentX = coords.x;
    context.currentY = coords.y;
  }

  onMouseMove(e: MouseEvent, context: DrawingContext): void {
    if (!this.isDrawing || !this.context) return;
    const coords = this.getCoordinates(e, context.canvas);
    this.path.push({ x: coords.x, y: coords.y });
    context.currentX = coords.x;
    context.currentY = coords.y;
    this.draw(context);
  }

  onMouseUp(_e: MouseEvent, _context: DrawingContext): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.path = [];
  }

  onTouchStart(e: TouchEvent, context: DrawingContext): void {
    this.isDrawing = true;
    this.context = context;
    const coords = this.getCoordinates(e, context.canvas);
    this.path = [{ x: coords.x, y: coords.y }];
    context.startX = coords.x;
    context.startY = coords.y;
    context.currentX = coords.x;
    context.currentY = coords.y;
  }

  onTouchMove(e: TouchEvent, context: DrawingContext): void {
    if (!this.isDrawing || !this.context) return;
    const coords = this.getCoordinates(e, context.canvas);
    this.path.push({ x: coords.x, y: coords.y });
    context.currentX = coords.x;
    context.currentY = coords.y;
    this.draw(context);
  }

  onTouchEnd(_e: TouchEvent, _context: DrawingContext): void {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.path = [];
  }

  private draw(context: DrawingContext): void {
    if (this.path.length < 2) return;

    context.ctx.save();
    // Highlighter uses lower opacity (30% of selected opacity) and wider brush
    context.ctx.globalAlpha = context.opacity * 0.3;
    context.ctx.strokeStyle = context.color;
    context.ctx.lineWidth = context.brushSize * 2;
    context.ctx.lineCap = 'round';
    context.ctx.lineJoin = 'round';

    context.ctx.beginPath();
    context.ctx.moveTo(this.path[0].x, this.path[0].y);
    for (let i = 1; i < this.path.length; i++) {
      context.ctx.lineTo(this.path[i].x, this.path[i].y);
    }
    context.ctx.stroke();
    context.ctx.restore();
  }
}

