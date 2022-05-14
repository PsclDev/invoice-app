<template>
  <div>
    <AppItem @edit="edit" @cancel="cancel" @save="save" @delete="deleteClient">
      <template #header>
        <div class="d-flex align-items-center">
          <font-awesome-icon
            class="me-2"
            :icon="['fa', isInvoice ? 'file-invoice-dollar' : 'file-invoice']"
          />
          <div class="d-flex">
            <div>
              {{ title }}
            </div>
          </div>
          <div class="ms-2 id">#{{ document.id }}</div>
        </div>
      </template>
      <template #action>
        <button
          v-show="!isInvoice && !document.invoiceId"
          class="btn btn-link"
          @click="convertToInvoice"
        >
          <font-awesome-icon :icon="['fas', 'file-invoice']" />
        </button>
        <button
          class="btn btn-link"
          data-bs-toggle="modal"
          :data-bs-target="`#d${document.id}`"
        >
          <font-awesome-icon :icon="['fas', 'paper-plane']" />
        </button>
      </template>
      <template #body>
        <div class="container">
          <div v-if="document.createdAt && document.updatedAt" class="row mb-2">
            <div class="col-sm-6 id text-center">
              {{ $t('common.createdAt') }}
              {{ getDate(document.createdAt, true) }}
            </div>
            <div class="col-sm-6 id text-center">
              {{ $t('common.updatedAt') }}
              {{ getDate(document.updatedAt, true) }}
            </div>
          </div>
          <DocumentForm
            :value="mutableDoc"
            :document-type="getDocumentType(mutableDoc)"
            :view-mode="viewMode"
            @input="(e) => (mutableDoc = e)"
          ></DocumentForm>
        </div>
      </template>
    </AppItem>

    <div
      :id="`d${document.id}`"
      class="modal fade"
      data-bs-backdrop="static"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('documents.send_modal.title') }}</h5>
            <button class="btn btn-close-modal" data-bs-dismiss="modal">
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              {{ $t('documents.send_modal.body') }}
            </div>
            <div class="d-flex justify-content-center gap-3">
              <a
                class="btn btn-warning w-50"
                data-bs-dismiss="modal"
                target="_blank"
                rel="noopener noreferrer"
                :href="printUrl"
              >
                {{ $t('documents.send_modal.print') }}
              </a>
              <button
                class="btn btn-info w-50"
                data-bs-dismiss="modal"
                @click="mailDocument"
              >
                {{ $t('documents.send_modal.mail') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import DocumentModule from '~/store/document';
import { Document } from '~/models/document';
import { DocumentType } from '~/types/document';
import { ViewMode } from '~/types/viewMode';
import { getDate, getDocumentType, getMutableDocument } from '~/utils/helper';

export default Vue.extend({
  name: 'DocumentItemComponent',
  props: {
    document: {
      type: Object as () => Document,
      required: true,
    },
  },
  data() {
    return {
      ViewMode,
      DocumentType,
      getDate,
      getDocumentType,
      viewMode: ViewMode.SHOW,
      store: getModule(DocumentModule, this.$store),
      mutableDoc: {} as Document,
    };
  },
  computed: {
    title() {
      if (this.document.invoiceNr) {
        return `${this.$t('documents.invoice')} #${String(
          this.document.invoiceNr
        ).padStart(4, '0')}`;
      }
      return `${this.$t('documents.offer')} #${String(
        this.document.offerNr
      ).padStart(4, '0')}`;
    },
    printUrl() {
      const baseUrl = this.$config.apiBaseUrl;
      const store = getModule(DocumentModule, this.$store);
      const prefix = store.Prefix;

      return `${baseUrl}${prefix}/print/${this.document.id}`;
    },
    isInvoice() {
      return getDocumentType(this.document) === DocumentType.INVOICE;
    },
  },
  mounted() {
    this.setDocument();
  },
  methods: {
    setDocument() {
      this.mutableDoc = getMutableDocument(this.document);
    },
    async convertToInvoice() {
      await this.store.convertToInvoice(this.document);
    },
    async mailDocument() {
      await this.store.mailDocument(this.document.id);
    },
    edit(viewMode: ViewMode) {
      this.viewMode = viewMode;
    },
    save(viewMode: ViewMode) {
      this.viewMode = viewMode;
      this.store.updateDocument(this.mutableDoc);
    },
    cancel(viewMode: ViewMode) {
      this.viewMode = viewMode;
      this.setDocument();
    },
    deleteClient() {
      this.store.deleteDocument(this.mutableDoc);
    },
  },
});
</script>

<style lang="scss" scoped>
.id {
  font-size: 0.7rem;
  opacity: 0.33;
}

.btn-close-modal {
  color: $body-text;
}
</style>
