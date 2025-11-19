export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class ScreenSelector {
  private overlay: HTMLDivElement | null = null;
  private selectionBox: HTMLDivElement | null = null;
  private isSelecting: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private currentRect: SelectionRect | null = null;
  private onSelectCallback: ((rect: SelectionRect) => void) | null = null;
  private onCancelCallback: (() => void) | null = null;

  constructor() {}

  startSelection(
    onSelect: (rect: SelectionRect) => void,
    onCancel: () => void
  ): void {
    this.onSelectCallback = onSelect;
    this.onCancelCallback = onCancel;
    this.createOverlay();
    this.attachEventListeners();
  }

  private createOverlay(): void {
    // Remove existing overlay if any
    this.destroy();

    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'screenshot-selector-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999998;
      cursor: crosshair;
      user-select: none;
    `;

    // Create selection box
    this.selectionBox = document.createElement('div');
    this.selectionBox.className = 'screenshot-selector-box';
    this.selectionBox.style.cssText = `
      position: absolute;
      border: 2px dashed #4a90e2;
      background: rgba(74, 144, 226, 0.1);
      pointer-events: none;
      display: none;
    `;

    this.overlay.appendChild(this.selectionBox);
    document.body.appendChild(this.overlay);
  }

  private attachEventListeners(): void {
    if (!this.overlay) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.isSelecting = true;
      this.startX = e.clientX;
      this.startY = e.clientY;

      if (this.selectionBox) {
        this.selectionBox.style.display = 'block';
        this.updateSelectionBox(this.startX, this.startY, 0, 0);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!this.isSelecting) return;
      e.preventDefault();
      e.stopPropagation();

      const currentX = e.clientX;
      const currentY = e.clientY;
      const width = Math.abs(currentX - this.startX);
      const height = Math.abs(currentY - this.startY);
      const x = Math.min(this.startX, currentX);
      const y = Math.min(this.startY, currentY);

      this.updateSelectionBox(x, y, width, height);
      this.currentRect = { x, y, width, height };
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!this.isSelecting) return;
      e.preventDefault();
      e.stopPropagation();

      this.isSelecting = false;

      if (this.currentRect && this.currentRect.width > 10 && this.currentRect.height > 10) {
        if (this.onSelectCallback) {
          this.onSelectCallback(this.currentRect);
        }
      }

      this.destroy();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (this.onCancelCallback) {
          this.onCancelCallback();
        }
        this.destroy();
      }
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.isSelecting = true;
      this.startX = touch.clientX;
      this.startY = touch.clientY;

      if (this.selectionBox) {
        this.selectionBox.style.display = 'block';
        this.updateSelectionBox(this.startX, this.startY, 0, 0);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!this.isSelecting) return;
      e.preventDefault();
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const currentY = touch.clientY;
      const width = Math.abs(currentX - this.startX);
      const height = Math.abs(currentY - this.startY);
      const x = Math.min(this.startX, currentX);
      const y = Math.min(this.startY, currentY);

      this.updateSelectionBox(x, y, width, height);
      this.currentRect = { x, y, width, height };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!this.isSelecting) return;
      e.preventDefault();
      this.isSelecting = false;

      if (this.currentRect && this.currentRect.width > 10 && this.currentRect.height > 10) {
        if (this.onSelectCallback) {
          this.onSelectCallback(this.currentRect);
        }
      }

      this.destroy();
    };

    this.overlay.addEventListener('mousedown', handleMouseDown);
    this.overlay.addEventListener('mousemove', handleMouseMove);
    this.overlay.addEventListener('mouseup', handleMouseUp);
    this.overlay.addEventListener('touchstart', handleTouchStart);
    this.overlay.addEventListener('touchmove', handleTouchMove);
    this.overlay.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);
  }

  private updateSelectionBox(x: number, y: number, width: number, height: number): void {
    if (!this.selectionBox) return;
    this.selectionBox.style.left = `${x}px`;
    this.selectionBox.style.top = `${y}px`;
    this.selectionBox.style.width = `${width}px`;
    this.selectionBox.style.height = `${height}px`;
  }

  destroy(): void {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.selectionBox = null;
    this.isSelecting = false;
    this.currentRect = null;
  }
}

