import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  loading = signal<boolean>(false);
  isModalOpened = signal(false);
  setLoading(val: boolean) {
    this.loading.set(val);
  }
  setModal(val: boolean) {
    this.isModalOpened.set(val);
  }
}
