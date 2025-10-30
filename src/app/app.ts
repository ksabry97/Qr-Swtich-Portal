import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QrSpinner } from './shared/components/qr-spinner/qr-spinner';
import { CommonModule } from '@angular/common';
import { GlobalService } from './shared/services/global.service';
import { TranslateService } from '@ngx-translate/core';
import { ResourcesObject } from './modules/roles/interfaces/role';
import { jwtDecode } from 'jwt-decode';
interface JwtPayload {
  sub: string;
  name?: string;
  email?: string;
  realm_access?: { roles?: string[] }; // adjust key based on your token structure
  [key: string]: any;
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, QrSpinner, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  isLoading = signal(false);
  protected readonly title = signal('qr-swtich-portal');
  globalServ = inject(GlobalService);
  constructor(private translate: TranslateService) {
    const saved = localStorage.getItem('lang') || 'en';
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translate.use(saved);
  }

  ngOnInit(): void {
    this.isLoading = this.globalServ.loading;
    this.getAllPermissions();
  }

  getAllPermissions() {
    this.globalServ.getAllPermissions().subscribe({
      next: (data: any) => {
        let permissions = Object.fromEntries(
          data.data.map(
            ({
              resource,
              permissions,
            }: {
              resource: string;
              permissions: { name: string; code: any }[];
            }) => [
              resource,
              {
                permissions: Object.fromEntries(
                  permissions.map((p) => [p.name, p.code])
                ),
              },
            ]
          )
        ) as Partial<ResourcesObject>;

        this.globalServ.PermissionsPerModule.next(permissions);
        const token = localStorage.getItem('token') || '';

        const decoded = jwtDecode<JwtPayload>(token);

        let roles = decoded.realm_access?.roles || decoded['role'] || [];

        roles = Array.isArray(roles) ? roles : [roles];
        this.globalServ.usersPermission.next(roles);
      },
    });
  }
}
