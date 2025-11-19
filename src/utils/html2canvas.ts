import html2canvas from 'html2canvas';

export interface ScreenshotOptions {
  rect?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  element?: HTMLElement;
  fullPage?: boolean;
}

export class ScreenshotCapture {
  static async capture(options: ScreenshotOptions = {}): Promise<Blob> {
    const canvasOptions: any = {
      useCORS: true,
      allowTaint: false,
      scale: 1,
      logging: false,
      backgroundColor: '#ffffff',
    };

    let canvas: HTMLCanvasElement;

    if (options.element) {
      // Capture specific element
      canvas = await html2canvas(options.element, canvasOptions);
    } else if (options.rect) {
      // Capture full page first, then crop to selected region
      canvas = await html2canvas(document.body, canvasOptions);
      
      // Crop the canvas to the selected region
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = options.rect.width;
      croppedCanvas.height = options.rect.height;
      const ctx = croppedCanvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(
          canvas,
          options.rect.x,
          options.rect.y,
          options.rect.width,
          options.rect.height,
          0,
          0,
          options.rect.width,
          options.rect.height
        );
        canvas = croppedCanvas;
      }
    } else {
      // Capture full page
      canvasOptions.width = window.innerWidth;
      canvasOptions.height = window.innerHeight;
      canvas = await html2canvas(document.body, canvasOptions);
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        'image/png',
        1.0
      );
    });
  }

  static async captureToDataURL(options: ScreenshotOptions = {}): Promise<string> {
    const canvasOptions: any = {
      useCORS: true,
      allowTaint: false,
      scale: 1,
      logging: false,
      backgroundColor: '#ffffff',
    };

    let canvas: HTMLCanvasElement;

    if (options.element) {
      canvas = await html2canvas(options.element, canvasOptions);
    } else if (options.rect) {
      // Capture full page first, then crop to selected region
      canvas = await html2canvas(document.body, canvasOptions);
      
      // Crop the canvas to the selected region
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = options.rect.width;
      croppedCanvas.height = options.rect.height;
      const ctx = croppedCanvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(
          canvas,
          options.rect.x,
          options.rect.y,
          options.rect.width,
          options.rect.height,
          0,
          0,
          options.rect.width,
          options.rect.height
        );
        canvas = croppedCanvas;
      }
    } else {
      canvasOptions.width = window.innerWidth;
      canvasOptions.height = window.innerHeight;
      canvas = await html2canvas(document.body, canvasOptions);
    }

    return canvas.toDataURL('image/png', 1.0);
  }
}

