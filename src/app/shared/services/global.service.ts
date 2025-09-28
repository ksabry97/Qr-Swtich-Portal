import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  loading = signal<boolean>(false);

  setLoading(val: boolean) {
    this.loading.set(val);
  }
}
