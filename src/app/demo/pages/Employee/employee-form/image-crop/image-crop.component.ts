import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-crop',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent, MatDialogModule],
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.scss']
})
export class ImageCropComponent {
  imageChangedEvent: Event | any = null;
  croppedImage: SafeUrl = '';
  selectedImage;
  cropedFile;

  constructor(private sanitizer: DomSanitizer, public dialogRef: MatDialogRef<ImageCropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { file: File }) {
    this.imageChangedEvent = data?.file;

    if (data?.file) {
      const file = data?.file['target'].files[0];
      this.selectedImage = file
    }
  }

  imageCropped(event: any) {
    this._fetchBlob(event?.objectUrl).then(blob => {
      const binaryFile = new File([blob], this.selectedImage?.name, { type: blob.type });
      this.cropedFile = binaryFile;
    }).catch(error => console.error('Error fetching blob:', error));
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event?.objectUrl);
  }


  onClose() {
    this.dialogRef.close();
  }

  onAccept() {
    this.dialogRef.close(this.cropedFile);
  }


  private _fetchBlob(url: string): Promise<Blob> {
    return fetch(url).then(response => response.blob());
  }

}
