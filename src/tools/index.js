export function formatNumber(number) {
  return new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 3 }).format(number);
}
