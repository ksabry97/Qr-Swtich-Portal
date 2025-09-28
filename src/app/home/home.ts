import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QrSidebar } from '../shared/components/qr-sidebar/qr-sidebar';
import { QrHeader } from '../shared/components/qr-header/qr-header';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, QrSidebar, QrHeader],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
