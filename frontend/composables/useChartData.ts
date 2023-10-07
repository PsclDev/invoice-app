import { DocumentYearStats } from '~/types';

export default function useChartData(data: DocumentYearStats[]) {
  const { t } = useI18n();
  const mainTabs = ['YEARLY', 'QUARTERLY', 'MONTHLY'];
  const yearTabs = data.map((item) => item.year.toString());

  const transform = (mainTab: string, yearTab: string) => {
    const invoiceOptions = {
      label: t('DASHBOARD.STATS.DOCUMENT.INVOICES'),
      backgroundColor: '#9f6380',
    };
    const offerOptions = {
      label: t('DASHBOARD.STATS.DOCUMENT.OFFER'),
      backgroundColor: '#c99db6',
    };
    switch (mainTab) {
      case 'YEARLY':
        return {
          labels: data.map((item) => item.year),
          datasets: [
            {
              ...invoiceOptions,
              data: data.map((item) => item.invoices),
            },
            {
              ...offerOptions,
              data: data.map((item) => item.offers),
            },
          ],
        };
      case 'QUARTERLY':
        return {
          labels: Array.from({ length: 4 }, (_, i) =>
            t(`DASHBOARD.LABELS.QUARTERS.${i + 1}`),
          ),
          datasets: [
            {
              ...invoiceOptions,
              data:
                data
                  .find((item) => item.year === Number(yearTab))
                  ?.quarters.map((quarter) => quarter.invoices) || [],
            },
            {
              ...offerOptions,
              data:
                data
                  .find((item) => item.year === Number(yearTab))
                  ?.quarters.map((quarter) => quarter.offers) || [],
            },
          ],
        };
      case 'MONTHLY':
        return {
          labels: Array.from({ length: 12 }, (_, i) =>
            t(`DASHBOARD.LABELS.MONTHS.${i + 1}`),
          ),
          datasets: [
            {
              ...invoiceOptions,
              data:
                data
                  .find((item) => item.year === Number(yearTab))
                  ?.months.map((month) => month.invoices) || [],
            },
            {
              ...offerOptions,
              data:
                data
                  .find((item) => item.year === Number(yearTab))
                  ?.months.map((month) => month.offers) || [],
            },
          ],
        };
      default:
        return {};
    }
  };

  return {
    transform,
    mainTabs,
    yearTabs,
  };
}
