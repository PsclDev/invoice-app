import { HealthResponse } from '~/types/health.interface'

export const useHealthStore = defineStore('health', () => {
    const apiIsRunning = ref(false)
    const dbIsRunning = ref(false)
    const lastCheck = ref(Date.now())

    async function checkHealth() {
        try {
            const apiUrl = useRuntimeConfig().public.apiUrl;
            const { data } = await useFetch<HealthResponse>(`${apiUrl}/health`)
            apiIsRunning.value = data.value!.info.api.status === 'up'
            dbIsRunning.value = data.value!.info.database.status === 'up';
            lastCheck.value = Date.now()
        } catch (error) {
            console.log(error)
        }
    }

    return { apiIsRunning, dbIsRunning, lastCheck, checkHealth }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHealthStore, import.meta.hot))
}