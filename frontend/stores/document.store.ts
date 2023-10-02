import { Document, DocumentForm, DocumentType } from '@/types';

export const useDocumentStore = defineStore('document', () => {
  const i18n = useI18n();
  const { getName } = useDocumentHelper();
  const logger = useLogger('documentStore');
  const toast = useToast();
  const documents = ref<Document[]>([]);
  const reqUrl = useApiUrl() + '/document';

  function getRequestUrl(type: DocumentType) {
    return type === DocumentType.OFFER
      ? `${reqUrl}/offer`
      : `${reqUrl}/invoice`;
  }

  async function getNewId(type: DocumentType) {
    try {
      logger.info('documentStore.getNewId');
      const url = getRequestUrl(type);
      const { data, error } = await useFetch<Number>(url + '/nr');
      if (!data.value || error.value) {
        throw error.value;
      }

      return {
        field: type === DocumentType.OFFER ? 'offerNr' : 'invoiceNr',
        value: Number(data.value),
      };
    } catch (error) {
      toast.add({
        color: 'red',
        title: i18n.t('DOCUMENTS.STORE.NEW_ID_FAILED'),
      });
      logger.error('Failed to get new id for document', error);
    }
  }

  function getById(id: string): Document {
    return documents.value.find((c) => c.id === id)!;
  }

  async function getAll() {
    try {
      logger.info('documentStore.getAll');
      const { data, error } = await useFetch<Document[]>(reqUrl);
      if (!data.value || error.value) {
        throw error.value;
      }

      documents.value = data.value;
    } catch (error) {
      toast.add({
        color: 'red',
        title: i18n.t('DOCUMENTS.STORE.GET_ALL_FAILED'),
      });
      logger.error('Failed to get all documents', error);
    }
  }

  async function create(form: DocumentForm, clientId: string) {
    try {
      logger.info('documentStore.create');
      const url = getRequestUrl(form.type);
      const newId = await getNewId(form.type);

      if (!newId) {
        throw new Error('Failed to get new id');
      }

      const payload = {
        ...form,
        clientId,
        [newId.field]: newId.value,
        description: form.description.split('\n'),
      };
      const { data, error } = await useFetch<Document>(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!data.value || error.value) {
        throw error.value;
      }

      documents.value.unshift(data.value);
      return data.value.id;
    } catch (error) {
      toast.add({
        color: 'red',
        title: i18n.t('DOCUMENTS.STORE.CREATE_FAILED', { name: getName(form) }),
      });
      logger.error('Failed to create document', error);
    }
  }

  async function update(docId: string, form: DocumentForm) {
    try {
      logger.info('documentStore.update');
      const url = getRequestUrl(form.type);

      const payload = {
        ...form,
        description: form.description.split('\n'),
      };
      const { error } = await useFetch<Document>(`${url}/${docId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (error.value) {
        throw error.value;
      }

      const currentDocument = getById(docId);
      const index = documents.value.findIndex((x) => x.id === docId);
      documents.value[index] = Object.assign(currentDocument, payload);
    } catch (error) {
      toast.add({
        color: 'red',
        title: i18n.t('DOCUMENTS.STORE.UPDATE_FAILED', { name: getName(form) }),
      });
      logger.error('Failed to update document', error);
    }
  }

  async function deleteDocument(doc: Document) {
    try {
      logger.info('documentStore.deleteDocument');

      const { error } = await useFetch(`${reqUrl}/${doc.id}`, {
        method: 'delete',
      });
      if (error.value) {
        throw error.value;
      }

      documents.value = documents.value.filter((x) => x.id !== doc.id);
      toast.add({ title: `Deleted Document` });
    } catch (error) {
      toast.add({
        color: 'red',
        title: i18n.t('DOCUMENTS.STORE.CREATE_FAILED', { name: getName(doc) }),
      });
      logger.error('Failed to delete document', error);
    }
  }

  return { create, documents, deleteDocument, getById, getAll, update };
});
