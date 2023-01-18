import { useNuxtApp } from "#app";

const { $toast } = useNuxtApp();

export function showToast(
  type: "success" | "info" | "warning" | "danger" | "denied",
  message: string,
  timeout: number = 12
) {
  const { t } = useI18n();

  if (process.client) {
    $toast.show({
      type,
      message: t(message),
      timeout,
    });
  }
}
