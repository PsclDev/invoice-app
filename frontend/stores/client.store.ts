import loadash from 'lodash';

export const useClientStore = defineStore('client', () => {
  const i18n = useI18n();
  const { getName } = useClientHelper();
  const logger = useLogger('clientStore');
  const toast = useToast();
  const newClientNr = ref(0);
  const clients = ref<Client[]>([]);
  const reqUrl = useApiUrl() + '/client';

  function mapClient(clientDto: ClientDto): Client {
    const { documents, ...client } = clientDto;
    return {
      ...client,
      documents: documents.map((d) => ({
        id: d.id,
        type: d.type,
        offerNr: d.offerNr,
        invoiceNr: d.invoiceNr,
      })),
    };
  }

  async function getById(id: string) {
    try {
      logger.info('clientStore.getById');
      let client = clients.value.find((c) => c.id === id);
      if (client) {
        return client;
      }

      const { data, error } = await useFetch<ClientDto>(`${reqUrl}/${id}`);
      if (!data.value || error.value) {
        throw error.value;
      }

      client = mapClient(data.value);
      clients.value.push(client);
      return client;
    } catch (error) {
      toast.add({
        color: 'red',
        title: i18n.t('CLIENTS.STORE.GET_BY_ID_FAILED'),
      });
      logger.error(`Failed to get client by id ${id}`, error);
      return {} as Client;
    }
  }

  async function getAll() {
    try {
      logger.info('clientStore.getAll');
      const { data, error } = await useFetch<ClientDto[]>(reqUrl);
      if (!data.value || error.value) {
        throw error.value;
      }

      clients.value = data.value.map((c) => mapClient(c));
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
      documents: [],
    });

    newClientNr.value++;
  }

  async function create(clientId: string, form: ClientForm) {
    try {
      logger.info('clientStore.create');
      const url = form.company ? `${reqUrl}/company` : reqUrl;

      const payload = loadash.omitBy(form, loadash.isEmpty);
      const { data, error } = await useFetch<Client>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!data.value || error.value) {
        throw error.value;
      }

      clients.value = clients.value.filter((x) => x.id !== clientId);
      clients.value.unshift(data.value);
      return data.value.id;
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

      const payload = loadash.omitBy(form, loadash.isEmpty);
      const { error } = await useFetch<Client>(url, {
        method: 'PATCH',
        body: JSON.stringify({
          ...payload,
          email: form.email !== '' ? form.email : null,
        }),
      });
      if (error.value) {
        throw error.value;
      }

      const currentClient = await getById(clientId);
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

  function deleteNewClients() {
    logger.info('clientStore.deleteNewClients');
    clients.value = clients.value.filter((x) => !x.id.startsWith('new-'));
  }

  return {
    clients,
    create,
    deleteClient,
    deleteNewClients,
    getById,
    getAll,
    newClient,
    update,
  };
});
