<script setup lang="ts">
import { DateTime } from 'luxon';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const clientStore = useClientStore();
const documentStore = useDocumentStore();
const { clients } = storeToRefs(clientStore);
const { getName } = useClientHelper();
const { dateFormat } = useDocumentHelper();

await clientStore.getAll();
clientStore.newClient();

const clientList = ref(
  clients.value.map((client) => ({
    label: getName(client),
    value: client.id,
  })),
);

const selectedClient = ref(clientList.value[0]);
const client = ref<Client>({} as Client);

const clientId = route.query.clientId as string;
if (clientId) {
  selectedClient.value = clientList.value.find(
    (client) => client.value === clientId,
  )!;
  client.value = await clientStore.getById(selectedClient.value.value);
}

const clientForm = ref<ClientForm>({
  company: '',
  vat: '',
  gender: Gender.MALE,
  firstname: '',
  lastname: '',
  email: '',
  street: '',
  postalCode: '',
  city: '',
});

const documentForm = ref<DocumentForm>({
  type: DocumentType.OFFER,
  offerNr: 0,
  invoiceNr: 0,
  dateOfIssue: DateTime.now().toFormat(dateFormat),
  description: '',
  subTotal: 0,
  tax: 0,
  taxRate: 19,
  total: 0,
  alreadyPaid: 0,
  dueDate: DateTime.now().plus({ days: 8 }).toFormat(dateFormat),
});

async function createDocument() {
  const clientId = selectedClient.value.value.includes('new-')
    ? await clientStore.create(selectedClient.value.value, clientForm.value)
    : selectedClient.value.value;

  if (!clientId) return;

  const documentId = await documentStore.create(documentForm.value, clientId);
  if (!documentId) return;

  router.push('/documents');
}

watch(selectedClient, async () => {
  client.value = await clientStore.getById(selectedClient.value.value);
});

onBeforeRouteLeave((_, __, next) => {
  clientStore.deleteNewClients();
  next(true);
});

useHead({
  title: t('DOCUMENTS.NEW_TITLE'),
});
</script>

<template>
  <BasePage title="DOCUMENTS.NEW_TITLE">
    <UCard>
      <div class="flex flex-col gap-5">
        <USelectMenu
          v-model="selectedClient"
          class="w-full"
          :searchable="true"
          size="lg"
          :options="clientList"
        >
          <template #label>
            {{ selectedClient.label }}
          </template>
        </USelectMenu>

        <div>
          <h3 class="text-lg">Client Informations</h3>
          <hr class="my-2 h-px border-0 bg-slate-300 dark:bg-neutral-800" />
          <ClientNewDocumentForm
            v-if="selectedClient.value.includes('new-')"
            v-model="clientForm"
          />
          <ClientNewDocumentView v-else :client="client" />
        </div>

        <div>
          <h3 class="text-lg">Document Informations</h3>
          <hr class="my-2 h-px border-0 bg-slate-300 dark:bg-neutral-800" />
          <DocumentNewDocumentForm v-model="documentForm" />
        </div>

        <AppButton label="COMMON.BUTTONS.CREATE" @click="createDocument" />
      </div>
    </UCard>
  </BasePage>
</template>
~/models
