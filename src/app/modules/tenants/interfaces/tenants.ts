export interface Tenant {
  tenantName: string;
  tenantCode: string;
  countryId: string;
  environment: Enviroment;
  description: string;
  contactEmail: string;
  contactPhone: string;
  contactName: string;
  contactAddress: string;
}

enum Enviroment {
  development = 0,
  stagging,
  production,
}
