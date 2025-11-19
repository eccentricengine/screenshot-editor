export interface DrawingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  color: string;
  brushSize: number;
  opacity: number;
  fontSize: number;
}

export abstract class BaseTool {
  protected isDrawing: boolean = false;
  protected context: DrawingContext | null = null;

  abstract name: string;
  abstract icon: string;

  abstract onMouseDown(e: MouseEvent, context: DrawingContext): void;
  abstract onMouseMove(e: MouseEvent, context: DrawingContext): void;
  abstract onMouseUp(e: MouseEvent, context: DrawingContext): void;
  abstract onTouchStart(e: TouchEvent, context: DrawingContext): void;
  abstract onTouchMove(e: TouchEvent, context: DrawingContext): void;
  abstract onTouchEnd(e: TouchEvent, context: DrawingContext): void;

  protected getCoordinates(e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e instanceof MouseEvent) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    } else {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
  }
}

