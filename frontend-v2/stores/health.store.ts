import { useNuxtApp } from "#app";
import { HealthResponse } from "~/types";
import { showToast } from "~/helper/toast.helper";

export const useHealthStore = defineStore("health", () => {
  const { $toast } = useNuxtApp();
  const { t } = useI18n();
  const apiIsRunning = ref(false);
  const dbIsRunning = ref(false);
  const lastCheck = ref(Date.now());

  async function checkHealth() {
    try {
      const apiUrl = useRuntimeConfig().public.apiUrl;
      const { data } = await useFetch<HealthResponse>(`${apiUrl}/health`);
      lastCheck.value = Date.now();

      if (data.value) {
        apiIsRunning.value = data.value!.info.api.status === "up";
        dbIsRunning.value = data.value!.info.database.status === "up";
        return;
      }

      apiIsRunning.value = false;
      dbIsRunning.value = false;

      showToast("danger", "toast.health.failed");
    } catch (error) {
      console.log(error); //TODO
    }
  }

  return { apiIsRunning, dbIsRunning, lastCheck, checkHealth };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHealthStore, import.meta.hot));
}
