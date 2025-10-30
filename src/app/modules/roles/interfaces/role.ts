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
