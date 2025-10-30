export interface Role {
  name: string;
  description: string;
  assignPermissionIds: Array<string>;
}
export interface Roles {
  resource: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  isAllowed: boolean;
}
interface ResourcePermissions {
  permissions: Permission[];
  groupedPermissions: any[];
}
export interface ResourcesObject {
  Roles: ResourcePermissions;
  AuditLogs: ResourcePermissions;
  Tenants: ResourcePermissions;
  Users: ResourcePermissions;
  Merchants: ResourcePermissions;
  Fees: ResourcePermissions;
  Wallets: ResourcePermissions;
}
