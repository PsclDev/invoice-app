import { isEmpty, omitBy } from 'lodash';

import { Client, ClientForm, Gender } from '@/types';

export const useClientStore = defineStore('client', () => {
  const { getName } = useClientHelper();
  const logger = useLogger('clientStore');
  const toast = useToast();
  const newClientNr = ref(0);
  const clients = ref<Client[]>([]);
  const reqUrl = useApiUrl() + '/client';

  function getById(id: string): Client {
    return clients.value.find((c) => c.id === id)!;
  }

  async function getAll() {
    try {
      logger.info('clientStore.getAll');
      const { data, error } = await useFetch<Client[]>(reqUrl);
      if (!data.value || error.value) {
        throw error.value;
      }

      clients.value = data.value;
    } catch (error) {
      toast.add({ color: 'red', title: 'Failed to get all clients' });
      logger.error('Failed to get all clients', error);
    }
  }

  function newClient() {
    logger.info('clientStore.newClient');
    clients.value.unshift({
      id: `new-${newClientNr.value}`,
      company: '',
      vat: '',
      gender: Gender.MALE,
      firstname: 'New',
      lastname: 'Client',
      email: '',
      street: '',
      postalCode: '',
      city: '',
    });

    newClientNr.value++;
  }

  async function create(clientId: string, form: ClientForm) {
    try {
      logger.info('clientStore.create');
      const url = form.company
        ? `${reqUrl}/company/${clientId}`
        : `${reqUrl}/${clientId}`;

      const payload = omitBy(form, isEmpty);
      const { data, error } = await useFetch<Client>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!data.value || error.value) {
        throw error.value;
      }

      clients.value = clients.value.filter((x) => x.id !== clientId);
      clients.value.unshift(data.value);
    } catch (error) {
      toast.add({
        color: 'red',
        title: `Failed to create new client`,
      });
      logger.error('Failed to create new client', error);
    }
  }

  async function update(clientId: string, form: ClientForm) {
    try {
      logger.info('clientStore.update');
      const url = form.company
        ? `${reqUrl}/company/${clientId}`
        : `${reqUrl}/${clientId}`;

      const payload = omitBy(form, isEmpty);
      const { error } = await useFetch<Client>(url, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (error.value) {
        throw error.value;
      }

      const currentClient = getById(clientId);
      const index = clients.value.findIndex((x) => x.id === clientId);
      clients.value[index] = Object.assign(currentClient, form);
    } catch (error) {
      toast.add({
        color: 'red',
        title: `Failed to update '${form.firstname}' ${form.lastname}`,
      });
      logger.error('Failed to update client', error);
    }
  }

  async function deleteClient(client: Client) {
    try {
      logger.info('clientStore.deleteClient');
      if (client.id.startsWith('new-')) {
        clients.value = clients.value.filter((x) => x.id !== client.id);
        return;
      }

      const { error } = await useFetch(`${reqUrl}/${client.id}`, {
        method: 'delete',
      });
      if (error.value) {
        throw error.value;
      }

      clients.value = clients.value.filter((x) => x.id !== client.id);
      toast.add({ title: `Deleted Client: '${getName(client)}'` });
    } catch (error) {
      toast.add({ color: 'red', title: `Failed to delete ''` });
      logger.error('Failed to delete client', error);
    }
  }

  return { clients, create, deleteClient, getById, getAll, newClient, update };
});
