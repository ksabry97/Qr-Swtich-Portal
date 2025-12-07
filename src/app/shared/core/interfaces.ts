export interface Lookup<v> {
  text: string;
  value: v;
}
export interface QrRes {
  msisdn: string;
  amount: number;
  isStatic: boolean;
  purpose: string;
}
export enum LookupType {
  Unknown = 0,
  Country,
  City,
  Currency,
  MerchantCategoryCode,
  Merchant,
  MerchantType,
  IdentificationType,
  FeeProfile,
  Wallet,
  Tenant,
  Role,
  Permission,
}
export interface LookupData {
  [LookupType.Unknown]: any[];
  [LookupType.Country]: any[];
  [LookupType.City]: any[];
  [LookupType.Currency]: any[];
  [LookupType.MerchantCategoryCode]: any[];
  [LookupType.Merchant]: any[];
  [LookupType.MerchantType]: any[];
  [LookupType.IdentificationType]: any[];
  [LookupType.FeeProfile]: any[];
  [LookupType.Wallet]: any[];
  [LookupType.Tenant]: any[];
  [LookupType.Role]: any[];
  [LookupType.Permission]: any[];
}
