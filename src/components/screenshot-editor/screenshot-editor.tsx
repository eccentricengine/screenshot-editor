import { Component, Element, Event, EventEmitter, Method, Prop, State, h } from '@stencil/core';
import { ScreenSelector, SelectionRect } from '../../utils/screen-selector';
import { ScreenshotCapture } from '../../utils/html2canvas';

@Component({
  tag: 'screenshot-editor',
  styleUrl: 'screenshot-editor.css',
  shadow: true,
})
export class ScreenshotEditor {
  @Element() el!: HTMLElement;
  @Event() screenshotSelected!: EventEmitter<Blob>;
  @Event() editorOpened!: EventEmitter<void>;
  @Event() editorOutput!: EventEmitter<{ blob: Blob; base64: string }>;
  @Event() editorClosed!: EventEmitter<void>;

  @Prop() buttonLabel: string = 'Take Screenshot';
  @Prop() buttonPosition: string = 'bottom-right';
  @Prop() showButton: boolean = true;

  @State() isSelecting: boolean = false;
  @State() editorVisible: boolean = false;

  private selector: ScreenSelector = new ScreenSelector();
  private imageEditor?: HTMLImageEditorElement;

  componentDidLoad() {
    // Setup will happen when editor becomes visible
  }

  private setupEventListeners() {
    // Use setTimeout to ensure the element is in the DOM
    setTimeout(() => {
      const editor = this.el.shadowRoot?.querySelector('image-editor') as HTMLImageEditorElement | null;
      if (editor) {
        this.imageEditor = editor;
        this.imageEditor.addEventListener('editorOutput', (e: CustomEvent) => {
          this.editorOutput.emit(e.detail);
        });

        this.imageEditor.addEventListener('editorClosed', () => {
          this.editorVisible = false;
          this.editorClosed.emit();
        });
      }
    }, 0);
  }

  @Method()
  async startScreenshot(): Promise<void> {
    if (this.isSelecting) return;

    this.isSelecting = true;

    this.selector.startSelection(
      async (rect: SelectionRect) => {
        this.isSelecting = false;
        await this.captureScreenshot(rect);
      },
      () => {
        this.isSelecting = false;
      }
    );
  }

  @Method()
  async openEditor(image: string | Blob): Promise<void> {
    this.editorVisible = true;
    
    // Wait for component to be rendered and ready
    await this.waitForEditor();
    
    const editor = this.el.shadowRoot?.querySelector('image-editor') as HTMLImageEditorElement | null;
    if (editor) {
      this.imageEditor = editor;
      await this.imageEditor.loadImage(image);
      this.setupEventListeners();
      this.editorOpened.emit();
    } else {
      console.error('Image editor element not found');
    }
  }

  private async captureScreenshot(rect: SelectionRect) {
    try {
      console.log('Capturing screenshot for rect:', rect);
      // Destroy overlay before capturing to exclude it from screenshot
      this.selector.destroy();
      // Small delay to ensure overlay is removed
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const blob = await ScreenshotCapture.capture({ rect });
      console.log('Screenshot captured, blob size:', blob.size);
      this.screenshotSelected.emit(blob);

      // Open editor with the screenshot
      this.editorVisible = true;
      
      // Wait for component to be rendered and ready
      await this.waitForEditor();
      
      const editor = this.el.shadowRoot?.querySelector('image-editor') as HTMLImageEditorElement | null;
      if (editor) {
        console.log('Image editor found, loading image...');
        this.imageEditor = editor;
        await this.imageEditor.loadImage(blob);
        console.log('Image loaded into editor');
        this.setupEventListeners();
        this.editorOpened.emit();
      } else {
        console.error('Image editor element not found');
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      this.isSelecting = false;
    }
  }

  private async waitForEditor(maxAttempts: number = 50): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const checkEditor = () => {
        attempts++;
        const editor = this.el.shadowRoot?.querySelector('image-editor');
        if (editor) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Editor component did not render in time'));
        } else {
          setTimeout(checkEditor, 50);
        }
      };
      checkEditor();
    });
  }

  private handleButtonClick() {
    this.startScreenshot();
  }

  private getButtonPositionClass(): string {
    const positions: { [key: string]: string } = {
      'top-left': 'position-top-left',
      'top-right': 'position-top-right',
      'bottom-left': 'position-bottom-left',
      'bottom-right': 'position-bottom-right',
    };
    return positions[this.buttonPosition] || 'position-bottom-right';
  }

  render() {
    return (
      <div>
        {this.showButton && !this.editorVisible && (
          <button
            class={`screenshot-button ${this.getButtonPositionClass()}`}
            onClick={() => this.handleButtonClick()}
            disabled={this.isSelecting}
          >
            {this.isSelecting ? 'Selecting...' : this.buttonLabel}
          </button>
        )}
        {this.editorVisible && <image-editor></image-editor>}
      </div>
    );
  }
}

