<template>
  <div class="container pb-5">
    <div class="row mb-4">
      <h1>{{ $t('documents.new') }}</h1>
    </div>
    <div v-if="isLoading" class="text-center">
      <AppSpinner />
    </div>
    <AppCard v-else class="py-3">
      <div class="row col-12 col-md-6 offset-md-3 mb-3">
        <multiselect
          v-model="selectedClient"
          :options="clients"
          placeholder="Select client"
          track-by="id"
          label="id"
          :custom-label="getFullname"
          :allow-empty="false"
          deselect-label=""
        >
        </multiselect>
      </div>
      <div
        v-show="selectedClient && selectedClient.id === '1'"
        class="row mb-4"
      >
        <ClientForm
          :value="newClient"
          :client-type="ClientType.COMPANY"
          :hide-documents="true"
          :view-mode="viewMode"
          @input="(e) => (newClient = e)"
        ></ClientForm>
      </div>
      <div class="row">
        <div class="col-12 col-md-3 mb-3">
          <div class="d-flex gap-5">
            <div class="form-check">
              <input
                id="offer"
                v-model="newDocumentType"
                class="form-check-input"
                type="radio"
                checked
                :value="DocumentType.OFFER"
              />
              <label class="form-check-label" for="offer"> Offer </label>
            </div>
            <div class="form-check">
              <input
                id="invoice"
                v-model="newDocumentType"
                class="form-check-input"
                type="radio"
                :value="DocumentType.INVOICE"
              />
              <label class="form-check-label" for="invoice"> Invoice </label>
            </div>
          </div>
        </div>
        <DocumentForm
          :value="newDocument"
          :document-type="newDocumentType"
          :view-mode="viewMode"
          :hide-client="true"
          @input="(e) => (newDocument = e)"
        ></DocumentForm>
      </div>
      <div class="row">
        <div class="col text-center">
          <button
            class="col-8 col-md-6 btn btn-primary px-5 font-weight-bold"
            @click="create"
          >
            {{ $t('documents.create') }}
          </button>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import Multiselect from 'vue-multiselect';
import { Client, Document } from '~/models';
import DocumentModule from '~/store/document';
import ClientModule from '~/store/client';
import { ViewMode, DocumentType, ClientType } from '~/types';

export default Vue.extend({
  name: 'CreateDocumentdPage',
  components: { Multiselect },
  beforeRouteLeave(__, ___, next) {
    if (this.clientStore.clients.find((c) => c.id === '1'))
      this.clientStore.deleteLocalClient('1');
    next();
  },
  data() {
    return {
      ClientType,
      DocumentType,
      clientStore: getModule(ClientModule, this.$store),
      documentStore: getModule(DocumentModule, this.$store),
      isLoading: false,
      clients: [] as Client[],
      selectedClient: {} as Client,
      viewMode: ViewMode.EDIT,
      newClient: {} as Client,
      newDocumentType: DocumentType.INVOICE,
      newDocument: {} as Document,
    };
  },
  mounted() {
    this.getClients();
  },
  methods: {
    async getClients() {
      this.isLoading = true;
      if (this.clientStore.Clients.length === 0)
        await this.clientStore.getClients();
      this.clients = this.clientStore.Clients;

      const name = `${this.$t('clients.new_firstname')} ${this.$t(
        'clients.new_lastname'
      )}`;
      this.clientStore.createLocalClient(name);
      this.setDefaults();

      this.isLoading = false;
    },
    setDefaults() {
      const clientId = this.$route.query.client ? this.$route.query.client : 1;
      const idx = this.clients.findIndex((c) => c.id === clientId);

      if (idx !== -1) this.selectedClient = this.clients[idx];
      else this.selectedClient = this.clients[0];

      this.newDocument = {
        id: '0',
        clientId: '0',
        dateOfIssue: this.$dayjs().toDate(),
        description: [],
        subTotal: 0,
        taxRate: 19,
        tax: 0,
        alreadyPaid: 0,
        dueDate: this.$dayjs().add(8, 'day').toDate(),
        total: 0,
      };
    },
    getFullname(client: Client) {
      if (client.company)
        return `${client.company} ${client.firstname} ${client.lastname}`;
      return `${client.firstname} ${client.lastname}`;
    },
    async create() {
      const client =
        this.selectedClient.id === '1'
          ? await this.clientStore.createClient(this.newClient)
          : this.selectedClient;

      const document: Document = {
        ...this.newDocument,
        clientId: client.id,
        dateOfIssue: this.$dayjs(this.newDocument.dateOfIssue).format(
          'YYYY-MM-DD'
        ),
      };

      if (this.newDocumentType === DocumentType.OFFER) {
        document.offerNr = await this.documentStore.getOfferNr();
      } else {
        document.dueDate = this.$dayjs(this.newDocument.dueDate).format(
          'YYYY-MM-DD'
        );
        document.invoiceNr = await this.documentStore.getInvoiceNr();
      }

      await this.documentStore.createDocument(document);
      this.$router.push({ name: 'documents' });
    },
  },
});
</script>
