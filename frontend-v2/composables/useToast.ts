export default function useToast() {
  const show = (
    type: 'success' | 'info' | 'warning' | 'danger' | 'denied',
    message: string,
    formats: object = {},
    plural: number = 1,
    timeout: number = 12
  ) => {
    if (process.client) {
      const { $toast, $i18n } = useNuxtApp();

      $toast.show({
        type,
        message: $i18n.t(message, plural, formats),
        timeout
      });
    }
  };

  return { show };
}
