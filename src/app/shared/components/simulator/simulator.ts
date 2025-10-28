import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QrInputNumber } from '../qr-input-number/qr-input-number';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-simulator',
  imports: [CommonModule, FormsModule, QrInputNumber],
  templateUrl: './simulator.html',
  styleUrl: './simulator.scss',
})
export class Simulator {
  mssidn: number | null = null;
  base64FromServer: string | null = null; // set this from backend response
  qrDataUrl: SafeUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {
    this.setBase64(
      'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAE0lEQVQI12P4//8/AwAI/AL+PfK9vwAAAABJRU5ErkJggg=='
    );
  }

  // call this once you receive base64 string from backend
  setBase64(base64: string) {
    this.base64FromServer = base64;
    // prefix with mime type (adjust if backend uses svg/webp/etc)
    const dataUrl = `data:image/png;base64,${base64}`;
    // sanitize for Angular binding
    this.qrDataUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
  }
}
