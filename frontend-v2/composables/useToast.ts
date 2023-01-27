export default function useToast() {
  const show = (
    type: 'success' | 'info' | 'warning' | 'danger' | 'denied',
    message: string,
    formats: object = {},
    plural: number = 1,
    timeout: number = 12
  ) => {
    if (process.client) {
      const { $toast } = useNuxtApp();
      const { t } = useI18n();
      $toast.show({
        type,
        message: t(message, plural, formats),
        timeout
      });
    }
  };

  return { show };
}
