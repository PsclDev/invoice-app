export default function useCustomDateHelper() {
  const i18n = useI18n();

  const formatDate = (
    date: string | undefined,
    withTime: boolean,
    specificFormat: 'de' | 'en' | undefined = undefined,
  ): string => {
    let format = '';
    if (specificFormat) {
      format = specificFormat === 'de' ? 'DD.MM.YYYY' : 'YYYY-MM-DD';
    } else {
      format = i18n.locale.value === 'de' ? 'DD.MM.YYYY' : 'YYYY-MM-DD';
    }

    if (withTime) {
      return useDateFormat(date, `${format} HH:mm:ss`).value.replace('"', '');
    }

    return useDateFormat(date, format).value.replace('"', '');
  };

  return { formatDate };
}
