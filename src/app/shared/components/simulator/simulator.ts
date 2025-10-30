import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { QrInputNumber } from '../qr-input-number/qr-input-number';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-simulator',
  imports: [CommonModule, FormsModule, QrInputNumber, ReactiveFormsModule],
  templateUrl: './simulator.html',
  styleUrl: './simulator.scss',
})
export class Simulator {
  mssidn: number | null = null;

  simulatorForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.simulatorForm = this.fb.group({
      senderPhone: [],
      recieverPhone: [],
      amount: [],
    });
  }
}
