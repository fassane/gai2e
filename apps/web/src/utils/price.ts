import { pricingSteps } from '@/data';

const numberFormat = new Intl.NumberFormat('fr-FR');

export const formatXof = (amount: number) => `${numberFormat.format(amount)} FCFA`;
// Montant en centimes
export const formatEur = (cents: number) => `${numberFormat.format(cents / 100)} €`;

export const pricingTotal = {
  xof: pricingSteps.reduce((total, step) => total + step.amountXof, 0),
  eurCents: pricingSteps.reduce((total, step) => total + step.amountEurCents, 0),
};
