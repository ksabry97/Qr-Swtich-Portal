import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './modules/authentication/pages/login/login';
import { AuthGuard } from './shared/services/auth-guard.service';
import { ForgetPassword } from './modules/authentication/pages/forget-password/forget-password';
import { Dashboard } from './modules/dashboard/pages/dashboard/dashboard';
import { TenantList } from './modules/tenants/pages/tenant-list/tenant-list';
import { UserList } from './modules/users/pages/user-list/user-list';
import { RolesList } from './modules/roles/pages/roles-list/roles-list';
import { MerchantList } from './modules/merchants/pages/merchant-list/merchant-list';
import { WalletList } from './modules/wallets/pages/wallet-list/wallet-list';
import { FeesList } from './modules/fees/pages/fees-list/fees-list';
import { AuditLogsList } from './modules/auditLogs/pages/audit-logs-list/audit-logs-list';
import { LoginAuditsList } from './modules/loginAudits/pages/login-audits-list/login-audits-list';
import { TransactionsList } from './modules/transactions/pages/transactions-list/transactions-list';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'tenants',
        component: TenantList,
      },
      {
        path: 'users',
        component: UserList,
      },
      {
        path: 'roles',
        component: RolesList,
      },
      {
        path: 'wallets',
        component: WalletList,
      },
      {
        path: 'merchants',
        component: MerchantList,
      },
      {
        path: 'fees',
        component: FeesList,
      },
      {
        path: 'transactions',
        component: TransactionsList,
      },
      {
        path: 'audit-logs',
        component: AuditLogsList,
      },
      {
        path: 'login-audits',
        component: LoginAuditsList,
      },
    ],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'forget-password',
    component: ForgetPassword,
  },
];
