export interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  assignRoleById: Array<string>;
  tenantId: string;
}
