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
import { PermissonGuard } from './shared/services/permission-guard.service';
import { Simulator } from './shared/components/simulator/simulator';
import { UnAuthorized } from './shared/components/un-authorized/un-authorized';
import { WalletsSimulator } from './shared/components/wallets-simulator/wallets-simulator';
import { WalletWindow } from './shared/components/wallet-window/wallet-window';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'tenants',
        component: TenantList,
        canActivate: [PermissonGuard],
        data: { permission: 'Tenants.ViewTenant' },
      },
      {
        path: 'users',
        component: UserList,
        canActivate: [PermissonGuard],
        data: { permission: 'Users.ViewUser' },
      },
      {
        path: 'roles',
        component: RolesList,
        canActivate: [PermissonGuard],
        data: { permission: 'Roles.ViewRole' },
      },
      {
        path: 'wallets',
        component: WalletList,
        canActivate: [PermissonGuard],
        data: { permission: 'Wallets.ViewWallet' },
      },
      {
        path: 'merchants',
        component: MerchantList,
        canActivate: [PermissonGuard],
        data: { permission: 'Merchants.ViewMerchant' },
      },
      {
        path: 'fees',
        component: FeesList,
        canActivate: [PermissonGuard],
        data: { permission: 'Fees.ViewFee' },
      },
      {
        path: 'transactions',
        component: TransactionsList,
        canActivate: [PermissonGuard],
        data: { permission: 'Transactions.ViewTransaction' },
      },
      {
        path: 'audit-logs',
        component: AuditLogsList,
        canActivate: [PermissonGuard],
        data: { permission: 'AuditLogs.ViewAllLogs' },
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
  {
    path: 'simulator',
    component: Simulator,
  },
  {
    path: 'wallets-simulator',
    component: WalletsSimulator,
  },
  {
    path: 'unathourized',
    component: UnAuthorized,
  },
  {
    path: 'walletWindow',
    component: WalletWindow,
  },
];
