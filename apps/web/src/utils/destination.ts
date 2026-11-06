// Échéance indicative en clair : 300 → « Environ 10 mois avant la rentrée », -30 → « Environ 1 mois après la rentrée »
export function dueLabel(days: number | null) {
  if (days === null) return null;
  if (days === 0) return 'À la rentrée';
  const distance = Math.abs(days);
  const moment = days > 0 ? 'avant' : 'après';
  if (distance < 45) return `Environ ${distance} jour${distance > 1 ? 's' : ''} ${moment} la rentrée`;
  return `Environ ${Math.round(distance / 30)} mois ${moment} la rentrée`;
}
