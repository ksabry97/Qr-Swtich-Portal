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
