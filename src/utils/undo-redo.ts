export class UndoRedoManager {
  private undoStack: ImageData[] = [];
  private redoStack: ImageData[] = [];
  private maxHistorySize: number = 50;

  saveState(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.undoStack.push(imageData);

    // Limit history size
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }

    // Clear redo stack when new action is performed
    this.redoStack = [];
  }

  undo(canvas: HTMLCanvasElement): boolean {
    if (this.undoStack.length === 0) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Save current state to redo stack
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.redoStack.push(currentState);

    // Restore previous state
    const previousState = this.undoStack.pop();
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
      return true;
    }

    return false;
  }

  redo(canvas: HTMLCanvasElement): boolean {
    if (this.redoStack.length === 0) return false;

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    // Save current state to undo stack
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.undoStack.push(currentState);

    // Restore next state
    const nextState = this.redoStack.pop();
    if (nextState) {
      ctx.putImageData(nextState, 0, 0);
      return true;
    }

    return false;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}

