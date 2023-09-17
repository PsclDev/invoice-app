import { Document, DocumentForm, DocumentType } from '@/types';

export const useDocumentStore = defineStore('document', () => {
  const i18n = useI18n();
  const { getName } = useDocumentHelper();
  const logger = useLogger('documentStore');
  const toast = useToast();
  const documents = ref<Document[]>([]);
  const reqUrl = useApiUrl() + '/document';

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

  async function update(docId: string, form: DocumentForm) {
    try {
      logger.info('documentStore.update');
      const url =
        form.type === DocumentType.OFFER
          ? `${reqUrl}/offer`
          : `${reqUrl}/invoice`;

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
      logger.error('Failed to update client', error);
    }
  }

  async function deleteDocument(doc: Document) {
    try {
      logger.info('documentStore.deleteClient');

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
      logger.error('Failed to delete client', error);
    }
  }

  return { documents, deleteDocument, getById, getAll, update };
});
