<template>
  <AppCard @edit="edit" @cancel="cancel" @save="save" @delete="deleteClient">
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
        <div class="row mb-4">
          <App-Input
            v-model="mutableDoc.clientId"
            class="col-sm-4"
            :title="$t('documents.clientId')"
            :view-mode="viewMode"
          ></App-Input>
        </div>
        <div class="row mb-4">
          <App-Input
            v-model="mutableDoc.dateOfIssue"
            class="col-sm-4"
            :title="$t('documents.dateOfIssue')"
            :view-mode="viewMode"
          ></App-Input>
        </div>
        <div class="row mb-4">
          <App-Input
            v-model="mutableDoc.description"
            class="col-sm-4"
            :title="$t('documents.description')"
            :view-mode="viewMode"
          ></App-Input>
        </div>
        <div class="row mb-4">
          <App-Input
            v-model="mutableDoc.subTotal"
            class="col-sm-4"
            :title="$t('documents.subTotal')"
            :view-mode="viewMode"
          ></App-Input>
          <App-Input
            v-model="mutableDoc.tax"
            class="col-sm-4"
            :title="$t('documents.tax')"
            :view-mode="viewMode"
          ></App-Input>
          <App-Input
            v-if="isInvoice"
            v-model="mutableDoc.alreadyPaid"
            class="col-sm-4"
            :title="$t('documents.alreadyPaid')"
            :view-mode="viewMode"
          ></App-Input>
        </div>
        <div class="row mb-4">
          <App-Input
            v-model="mutableDoc.total"
            class="col-sm-4"
            :title="$t('documents.total')"
            :view-mode="viewMode"
          ></App-Input>
          <App-Input
            v-if="isInvoice"
            v-model="mutableDoc.dueDate"
            class="col-sm-4"
            :title="$t('documents.dueDate')"
            :view-mode="viewMode"
          ></App-Input>
        </div>
      </div>
    </template>
  </AppCard>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import DocumentModule from '~/store/document';
import { Document } from '~/models/document';
import ViewMode from '~/types/viewMode';

export default Vue.extend({
  name: 'DocumentComponent',
  props: {
    document: {
      type: Object as () => Document,
      required: true,
    },
  },
  data() {
    return {
      ViewMode,
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
      return `${this.$t('documents.offer')} ${this.$moment(
        this.document.dateOfIssue
      ).format('DD.MM.YYYY')}`;
    },
    isInvoice() {
      return this.document.invoiceNr;
    },
  },
  mounted() {
    this.setDocument();
  },
  methods: {
    setDocument() {
      this.mutableDoc = {
        id: this.document.id,
        clientId: this.document.clientId,
        dateOfIssue: this.document.dateOfIssue,
        description: this.document.description,
        createdAt: this.document.createdAt,
        updatedAt: this.document.updatedAt,
        invoiceNr: this.document.invoiceNr,
        subTotal: this.document.subTotal,
        tax: this.document.tax,
        total: this.document.total,
        alreadyPaid: this.document.alreadyPaid,
        dueDate: this.document.dueDate,
      };
    },
    getDate(date: Date, withTime: boolean = false) {
      return this.$moment(date).format(
        withTime ? 'DD.MM.YYYY HH:MM:SS' : 'DD.MM.YYYY'
      );
    },
    edit(viewMode: ViewMode) {
      this.viewMode = viewMode;
    },
    save(viewMode: ViewMode) {
      this.viewMode = viewMode;
      // TODO
      //   if (this.mutableClient.id) this.store.updateClient(this.mutableClient);
      //   else this.store.saveNewClient(this.mutableClient);
    },
    cancel(viewMode: ViewMode) {
      this.viewMode = viewMode;
      this.setDocument();
    },
    deleteClient() {
      // TODO
      //   this.store.deleteClient(this.mutableClient);
    },
  },
});
</script>

<style lang="scss" scoped>
.id {
  font-size: 0.7rem;
  opacity: 0.33;
}
</style>
