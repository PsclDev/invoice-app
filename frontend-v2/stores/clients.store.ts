import { ClientResponse } from '~~/types/client.interface';

export const useClientsStore = defineStore('clients', () => {
  const logger = useLogger('clientsStore');
  const toast = useToast();
  const reqUrl = useApiUrl() + '/client';
  const clients = ref<ClientResponse[]>({} as ClientResponse[]);
  const error = ref<string>();

  async function getClients() {
    try {
      const { data, error: reqErr } = await useFetch<ClientResponse[]>(reqUrl);

      if (!data.value || reqErr.value) {
        error.value = reqErr.value?.message;
        throw error;
      }

      clients.value = data.value;
    } catch (error) {
      logger.error('failed to get clients', error);
      toast.show('danger', 'toast.clients.get');
    }
  }

  return { clients, error, getClients };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useClientsStore, import.meta.hot));
}
