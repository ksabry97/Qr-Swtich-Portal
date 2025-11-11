import { Component, inject, OnInit } from '@angular/core';
import { WalletsService } from '../../../modules/wallets/services/wallets.service';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallets-simulator',
  imports: [CommonModule],
  templateUrl: './wallets-simulator.html',
  styleUrl: './wallets-simulator.scss',
})
export class WalletsSimulator implements OnInit {
  globalServ = inject(GlobalService);
  walletServ = inject(WalletsService);
  wallets: any[] = [];

  ngOnInit(): void {
    this.getAllWallets(1, 10);
  }
  getAllWallets(pageNumber: number, pageSize: number) {
    this.globalServ.setLoading(true);

    this.walletServ.getAllWallets(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.wallets = data.data.items;
      },
      error: () => {
        this.globalServ.setLoading(false);
      },
      complete: () => {
        this.globalServ.setLoading(false);
      },
    });
  }

  openWalletWindow(walletName: string, walletId: string) {
    window.open(
      `http://localhost:4200/walletWindow?name=${walletName}&id=${walletId}`,
      '_blank',
      'width=800,height=600,scrollbars=yes,resizable=no'
    );
  }
}
