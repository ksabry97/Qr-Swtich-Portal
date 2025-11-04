export interface Lookup<v> {
  text: string;
  value: v;
}
export interface SimulaterRes {
  senderMsisdn: string;
  amount: {
    value: number;
    currency: string;
  };
  description: string;
  receiverMsisdn: string;
}
