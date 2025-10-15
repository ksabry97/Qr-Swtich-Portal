export interface Wallet {
  name: string;
  description: string;
  baseUrl: string;
  port: number;
  type: WalletType;
  environment: number;
  status: number;
  isActive: boolean;
  macConnections: number;
  currentConnections: number;
  connectionTimeout: string;
  isHttps: boolean;
  apiKey: string;
  userName: string;
  userPassword: string;
  enableHealthChecks: boolean;
  healthChechInterval: string;
  notes: string;
}

enum WalletType {
  Wallet = 0,
  Bank,
}
