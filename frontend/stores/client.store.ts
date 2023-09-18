import { isEmpty, omitBy } from 'lodash';

import { Client, ClientDto, ClientForm, Gender } from '@/types';

export const useClientStore = defineStore('client', () => {
  const i18n = useI18n();
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
      const { data, error } = await useFetch<ClientDto[]>(reqUrl);
      if (!data.value || error.value) {
        throw error.value;
      }

      clients.value = data.value.map((c) => {
        const { documents, ...client } = c;
        return {
          ...client,
          documentIds: documents.map((d) => d.id),
        };
      });
    } catch (error) {
      toast.add({
        color: 'red',
        title: i18n.t('CLIENTS.STORE.GET_ALL_FAILED'),
      });
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
      documentIds: [],
    });

    newClientNr.value++;
  }

  async function create(clientId: string, form: ClientForm) {
    try {
      logger.info('clientStore.create');
      const url = form.company ? `${reqUrl}/company` : reqUrl;

      const payload = omitBy(form, isEmpty);
      const { data, error } = await useFetch<Client>(`${url}/${clientId}`, {
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
        title: i18n.t('CLIENTS.STORE.CREATE_FAILED', { name: getName(form) }),
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
        title: i18n.t('CLIENTS.STORE.UPDATE_FAILED', { name: getName(form) }),
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
      toast.add({
        color: 'red',
        title: i18n.t('CLIENTS.STORE.DELETE_FAILED', { name: getName(client) }),
      });
      logger.error('Failed to delete client', error);
    }
  }

  return { clients, create, deleteClient, getById, getAll, newClient, update };
});
