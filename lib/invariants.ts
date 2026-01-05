export const INVARIANTS = {
  phone: "03311090750",
  email: "info@sfrattomorosi.it",
  brand: "Sfratto Morosi",
  baseCost: "€ 1.300",
  execCost: "€ 1.200,00",
} as const;

export type Invariants = typeof INVARIANTS;
