export default function useCurrencyHelper() {
  const formatToEur = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return {
    formatToEur,
  };
}
