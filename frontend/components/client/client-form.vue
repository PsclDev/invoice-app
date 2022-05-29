<template>
  <div>
    <template
      v-if="clientType === ClientType.COMPANY || viewMode === ViewMode.EDIT"
    >
      <div class="row mb-4">
        <App-Input
          v-model="mutableClient.company"
          class="col-sm-4 mb-3 mb-sm-0"
          :title="$t('clients.company')"
          :view-mode="viewMode"
        ></App-Input>
        <App-Input
          v-model="mutableClient.vat"
          class="col-sm-4"
          :title="$t('clients.vat')"
          :view-mode="viewMode"
        ></App-Input>
      </div>
    </template>
    <div class="row mb-4">
      <App-Select
        v-model="mutableClient.gender"
        class="col-sm-4 mb-3 mb-sm-0"
        :view-mode="viewMode"
        labels="gender"
        :type="Gender"
      ></App-Select>
      <App-Input
        v-model="mutableClient.firstname"
        class="col-sm-4 mb-3 mb-sm-0"
        :title="$t('clients.firstname')"
        :view-mode="viewMode"
      ></App-Input>
      <App-Input
        v-model="mutableClient.lastname"
        class="col-sm-4"
        :title="$t('clients.lastname')"
        :view-mode="viewMode"
      ></App-Input>
    </div>
    <div class="row mb-4">
      <App-Input
        v-model="mutableClient.street"
        class="col-sm-4 mb-3 mb-sm-0"
        :title="$t('clients.street')"
        :view-mode="viewMode"
      ></App-Input>
      <App-Input
        v-model="mutableClient.postalCode"
        class="col-sm-4 mb-3 mb-sm-0"
        :title="$t('clients.postalCode')"
        :view-mode="viewMode"
      ></App-Input>
      <App-Input
        v-model="mutableClient.city"
        class="col-sm-4"
        :title="$t('clients.city')"
        :view-mode="viewMode"
      ></App-Input>
    </div>
    <div class="row mb-4">
      <App-Input
        v-model="mutableClient.email"
        class="col-sm-4"
        :view-mode="viewMode"
        :title="$t('clients.email')"
        type="email"
      ></App-Input>
    </div>
    <div v-show="!hideDocuments" class="row mb-4">
      <div class="col-sm-4">
        <div v-if="documentsLength === 0" class="d-flex align-items-center">
          <font-awesome-icon class="me-2" :icon="['fa', 'file-pdf']" />
          <div>
            {{ documentsLength }}
            {{ $tc('document', 2) }}
          </div>
        </div>
        <AppCollapse v-else>
          <template #header>
            <div class="d-flex align-items-center">
              <font-awesome-icon class="me-2" :icon="['fa', 'file-pdf']" />
              <div>
                {{ documentsLength }}
                {{ $tc('document', documentsLength === 1 ? 1 : 2) }}
              </div>
            </div>
          </template>
          <template #body>
            <ul>
              <li v-for="doc of documents" :key="doc.id">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  :href="printUrl(doc.id)"
                  >{{ getDocumentTitle(doc) }}
                </a>
              </li>
            </ul>
          </template>
        </AppCollapse>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import DocumentModule from '~/store/document';
import { Client, Document } from '~/models';
import { ViewMode, ClientType, Gender } from '~/types';
import { getMutableClient, getDocumentsLength } from '~/utils/helper';

export default Vue.extend({
  name: 'ClientFormComponent',
  props: {
    value: {
      type: Object as () => Client,
      required: true,
    },
    clientType: {
      type: String as () => ClientType,
      required: true,
    },
    viewMode: {
      type: String as () => ViewMode,
      required: true,
    },
    hideDocuments: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ClientType,
      ViewMode,
      Gender,
      shadowClient: {} as Client,
      mutableClient: {} as Client,
    };
  },
  computed: {
    documents(): Document[] {
      return this.value.documents ? this.value.documents : [];
    },
    documentsLength(): number {
      return getDocumentsLength(this.value);
    },
  },
  watch: {
    value() {
      this.setClient();
    },
    mutableClient: {
      handler() {
        const equal =
          JSON.stringify(this.mutableClient) ===
          JSON.stringify(this.shadowClient);

        if (!equal) this.$emit('input', this.mutableClient);
      },
      deep: true,
    },
  },
  methods: {
    setClient() {
      this.mutableClient = getMutableClient(this.value);
      this.shadowClient = getMutableClient(this.value);
    },
    getDocumentTitle(doc: Document) {
      const text = doc.invoiceNr ? 'invoice' : 'offer';
      const nr = doc.invoiceNr ? doc.invoiceNr : doc.offerNr;

      return `${this.$t(`documents.${text}`)} #${String(nr).padStart(4, '0')}`;
    },
    printUrl(id: string): string {
      const baseUrl = this.$config.apiBaseUrl;
      const docStore = getModule(DocumentModule, this.$store);
      const prefix = docStore.Prefix;

      return `${baseUrl}${prefix}/print/${id}`;
    },
  },
});
</script>
