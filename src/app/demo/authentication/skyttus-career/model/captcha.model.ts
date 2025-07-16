export class CaptchaImage {
    private readonly width: number;
    private readonly height: number;
    private readonly code: string;
  
    constructor(width: number, height: number, code: string) {
      this.width = width;
      this.height = height;
      this.code = code;
    }
  
    public generateImage(): string {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const context = canvas.getContext('2d');
  
      // Fill the canvas with a random color
      context!.fillStyle = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      context!.fillRect(0, 0, canvas.width, canvas.height);
  
      // Draw the Captcha code onto the canvas
      context!.font = '40px Arial';
      context!.fillStyle = 'white';
      context!.textAlign = 'center';
      context!.textBaseline = 'middle';
      context!.fillText(this.code, canvas.width / 2, canvas.height / 2);
  
      // Convert the canvas to a data URL
      const dataURL = canvas.toDataURL('image/png');
  
      return dataURL;
    }
  }
  