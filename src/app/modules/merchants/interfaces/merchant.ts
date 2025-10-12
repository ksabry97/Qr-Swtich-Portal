export interface Merchant {
  name: string;
  scheme: string;
  msisdn: string;
  merchantId: string;
  commercialRegNo: string;
  issuancePlaceCode: string;
  nationalId: string;
  soleProprietorshipLicense: string;
  serviceLicenseNumber: string;
  mcc: string;
  canPerformRegistration: boolean;
  parentId: string;
  countryId: string;
  city: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  lang: number;
  lat: number;
  feeProfileId: number;
  merchantType: MerchantType;
}

enum MerchantType {
  merchant = 0,
  agent,
  biller,
  aggregator,
}
