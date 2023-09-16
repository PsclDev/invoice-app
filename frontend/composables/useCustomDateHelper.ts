export default function useCustomDateHelper() {
  const i18n = useI18n();

  const formatDate = (date: string | undefined, withTime: boolean): string => {
    const format = i18n.locale.value === 'de' ? 'DD.MM.YYYY' : 'YYYY-MM-DD';

    if (withTime) {
      return useDateFormat(date, `${format} HH:mm:ss`).value.replace('"', '');
    }

    return useDateFormat(date, format).value.replace('"', '');
  };

  return { formatDate };
}
