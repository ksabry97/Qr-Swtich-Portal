export interface Fee {
  name: string;
  currency: string;
  feeType: FeeType;
  percentage: number | null;
  fixed: number | null;
}

enum FeeType {
  Fixed = 0,
  Percent,
}
