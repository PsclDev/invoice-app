<template>
  <div>
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
      <template #action>
        <button
          class="btn btn-link"
          data-bs-toggle="modal"
          data-bs-target="#sendDocument"
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
              :value="getDate(mutableDoc.dateOfIssue)"
              class="col-sm-4"
              :title="$t('documents.dateOfIssue')"
              :view-mode="viewMode"
              @valueChanged="(value) => dateChanged('dateOfIssue', value)"
            ></App-Input>
          </div>
          <div class="row mb-4">
            <div class="col-sm-8">
              <div>
                <label class="form-label">
                  {{ $t('documents.description') }}
                </label>
                <div v-if="viewMode === ViewMode.EDIT">
                  <textarea
                    v-model="description"
                    class="form-control"
                    rows="8"
                    @change="descriptionChanged"
                  ></textarea>
                </div>
                <div v-else v-html="descriptionToView"></div>
              </div>
            </div>
          </div>
          <div class="row mb-4">
            <App-Input
              v-model="mutableDoc.subTotal"
              type="number"
              class="col-sm-4 mb-3 mb-sm-0"
              :title="$t('documents.subTotal')"
              postfix="€"
              :view-mode="viewMode"
              @valueChanged="cashChanged"
            ></App-Input>
            <div class="col-sm-4 mb-3 mb-sm-0">
              <div>
                <label class="form-label">
                  {{ $t('documents.tax') }}
                </label>
                <div v-if="viewMode === ViewMode.EDIT">
                  <div class="input-group">
                    <span id="taxRate" class="input-group-text"
                      >{{ mutableDoc.tax }}€</span
                    >
                    <input
                      v-model="mutableDoc.taxRate"
                      type="number"
                      class="form-control"
                      aria-describedby="taxRate"
                      @change="cashChanged"
                    />
                    <span id="taxRate" class="input-group-text">%</span>
                  </div>
                </div>
                <div v-else>{{ mutableDoc.tax + '€' }}</div>
              </div>
            </div>
            <App-Input
              v-if="isInvoice"
              v-model="mutableDoc.alreadyPaid"
              type="number"
              class="col-sm-4"
              :title="$t('documents.alreadyPaid')"
              postfix="€"
              :view-mode="viewMode"
              @valueChanged="cashChanged"
            ></App-Input>
          </div>
          <div class="row mb-4">
            <App-Input
              v-model="mutableDoc.total"
              type="number"
              class="col-sm-4 mb-3 mb-sm-0"
              :title="$t('documents.total')"
              postfix="€"
              :view-mode="viewMode"
            ></App-Input>
            <App-Input
              v-if="isInvoice && mutableDoc.dueDate"
              :value="getDate(mutableDoc.dueDate)"
              class="col-sm-4"
              :title="$t('documents.dueDate')"
              :view-mode="viewMode"
              @valueChanged="(value) => dateChanged('dueDate', value)"
            ></App-Input>
          </div>
        </div>
      </template>
    </AppCard>

    <div
      id="sendDocument"
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
            <div class="mb-3">{{ $t('documents.send_modal.body') }}</div>
            <div class="d-flex justify-content-center gap-3">
              <button class="btn btn-warning w-50">
                {{ $t('documents.send_modal.print') }}
              </button>
              <button class="btn btn-info w-50">
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
      description: '',
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
    isInvoice() {
      return this.document.invoiceNr;
    },
    descriptionToView() {
      let text = '';
      if (this.mutableDoc.description)
        this.mutableDoc.description.forEach((i) => (text += i + '<br>'));

      return text;
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
        taxRate: this.document.taxRate,
        total: this.document.total,
        alreadyPaid: this.document.alreadyPaid,
        dueDate: this.document.dueDate,
      };
      this.mutableDoc.description.forEach(
        (i) => (this.description += i + '\n')
      );
    },
    getDate(date: Date, withTime: boolean = false) {
      return this.$dayjs(date).format(
        withTime ? 'DD.MM.YYYY HH:MM:ss' : 'DD.MM.YYYY'
      );
    },
    dateChanged(field: string, value: string) {
      switch (field) {
        case 'dateOfIssue':
          this.mutableDoc.dateOfIssue = this.$dayjs(
            value,
            'DD.MM.YYYY'
          ).toDate();
          this.mutableDoc.dueDate = this.$dayjs(value, 'DD.MM.YYYY')
            .add(12, 'day')
            .toDate();
          break;
        case 'dueDate':
          this.mutableDoc.dueDate = this.$dayjs(value, 'DD.MM.YYYY').toDate();
          break;
      }
    },
    descriptionChanged() {
      this.mutableDoc.description = this.description.split('\n');
    },
    cashChanged() {
      this.mutableDoc.tax =
        (this.mutableDoc.subTotal * this.mutableDoc.taxRate) / 100;
      this.mutableDoc.total =
        +this.mutableDoc.subTotal +
        +this.mutableDoc.tax -
        +(this.mutableDoc.alreadyPaid ? this.mutableDoc.alreadyPaid : 0);
    },
    printDocument() {
      this.store.printDocument(this.mutableDoc);
    },
    mailDocument() {
      this.store.mailDocument(this.mutableDoc);
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

textarea {
  resize: none;
}

.input-group > .form-control {
  flex: inherit;
  width: 10%;
  min-width: 96px;
  text-align: right;
}

.input-group-text {
  color: $body-text;
  background-color: $tertiary-background;
  border-color: transparent;
  flex: inherit;
  justify-content: flex-end;
  &:first-of-type {
    flex: 1 1 auto;
  }
}

.btn-close-modal {
  color: $body-text;
}
</style>
