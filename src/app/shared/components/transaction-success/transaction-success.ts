import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-transaction-success',
  imports: [CommonModule, TranslateModule],
  templateUrl: './transaction-success.html',
  styleUrl: './transaction-success.scss',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.3s ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('scaleIn', [
      state('void', style({ transform: 'scale(0.8)', opacity: 0 })),
      transition(':enter', [
        animate('0.5s cubic-bezier(0.34, 1.56, 0.64, 1)', style({ 
          transform: 'scale(1)', 
          opacity: 1 
        }))
      ])
    ]),
    trigger('checkmark', [
      state(
        'void',
        style({
          strokeDashoffset: 100,
          opacity: 0,
        })
      ),
      transition(':enter', [
        // duration 0.6s, delay 0.3s, easing ease-out
        animate(
          '0.6s 0.3s ease-out',
          style({
            strokeDashoffset: 0,
            opacity: 1,
          })
        ),
      ]),
    ]),
  ]
})
export class TransactionSuccess implements OnInit {
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    // Optional: Auto-redirect after 5 seconds
    // setTimeout(() => {
    //   this.router.navigateByUrl('/dashboard');
    // }, 5000);
  }

  goToDashboard() {
    this.router.navigateByUrl('/dashboard');
  }

  goBack() {
    window.history.back();
  }
}

