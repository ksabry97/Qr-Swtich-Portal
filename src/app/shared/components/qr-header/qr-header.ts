import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../services/global.service';
import { ResourcesObject } from '../../../modules/roles/interfaces/role';
import { jwtDecode } from 'jwt-decode';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
interface JwtPayload {
  sub: string;
  name?: string;
  email?: string;
  realm_access?: { roles?: string[] }; // adjust key based on your token structure
  [key: string]: any;
  preferred_username: string;
}
@Component({
  selector: 'app-qr-header',
  imports: [
    NzDropDownModule,
    NzButtonModule,
    CommonModule,
    NzIconModule,
    LanguageSwitcher,
    TranslateModule,
    NzAvatarModule,
  ],
  providers: [TranslateService],
  templateUrl: './qr-header.html',
  styleUrl: './qr-header.scss',
})
export class QrHeader implements OnInit {
  router = inject(Router);
  globalServ = inject(GlobalService);
  username = '';
  logOut() {
    this.router.navigateByUrl('/login');
    localStorage.clear();
  }

  ngOnInit(): void {
    this.getAllPermissions();
    this.username = localStorage.getItem('username') ?? '';
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
        localStorage.setItem('username', decoded?.preferred_username);
        this.username = decoded?.preferred_username;
        let roles = decoded.realm_access?.roles || decoded['role'] || [];

        roles = Array.isArray(roles) ? roles : [roles];
        this.globalServ.usersPermission.next(roles);
      },
    });
  }
}
