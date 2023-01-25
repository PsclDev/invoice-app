export function showToast(
  type: 'success' | 'info' | 'warning' | 'danger' | 'denied',
  message: string,
  timeout: number = 12
) {
  if (process.client) {
    const { $toast } = useNuxtApp();
    const { t } = useI18n();
    $toast.show({
      type,
      message: t(message),
      timeout
    });
  }
}
