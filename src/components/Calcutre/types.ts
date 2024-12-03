export type Product = {
  name: string;
  price: number;
};

export interface DiscountInputs {
  discount1: number;
  discount2: number;
  discount3: { buy: number; get: number };
  discount4: string;
}
