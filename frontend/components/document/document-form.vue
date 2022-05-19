<template>
  <div>
    <div v-if="!hideClient" class="row mb-4">
      <App-Input
        v-model="mutableDocument.clientId"
        class="col-sm-4"
        :title="$t('documents.clientId')"
        :view-mode="ViewMode.SHOW"
      ></App-Input>
    </div>
    <div class="row mb-4">
      <App-Input
        :value="getDate(mutableDocument.dateOfIssue)"
        class="col-10 col-sm-4"
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
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-else v-html="descriptionToView"></div>
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <App-Input
        v-model.number="mutableDocument.subTotal"
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
                >{{ mutableDocument.tax }}€</span
              >
              <input
                v-model.number="mutableDocument.taxRate"
                type="number"
                class="form-control"
                aria-describedby="taxRate"
                @change="cashChanged"
              />
              <span id="taxRate" class="input-group-text">%</span>
            </div>
          </div>
          <div v-else>{{ mutableDocument.tax + '€' }}</div>
        </div>
      </div>
      <App-Input
        v-if="documentType === DocumentType.INVOICE"
        v-model.number="mutableDocument.alreadyPaid"
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
        v-model.number="mutableDocument.total"
        type="number"
        class="col-sm-4 mb-3 mb-sm-0"
        :title="$t('documents.total')"
        postfix="€"
        :view-mode="viewMode"
      ></App-Input>
      <App-Input
        v-if="documentType === DocumentType.INVOICE"
        :value="getDate(mutableDocument.dueDate)"
        class="col-sm-4"
        :title="$t('documents.dueDate')"
        :view-mode="viewMode"
        @valueChanged="(value) => dateChanged('dueDate', value)"
      ></App-Input>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Document } from '~/models/document';
import { ViewMode } from '~/types';
import { DocumentType } from '~/types/document';
import { getDate, getMutableDocument } from '~/utils/helper';

export default Vue.extend({
  name: 'DocumentFormComponent',
  props: {
    value: {
      type: Object as () => Document,
      required: true,
    },
    documentType: {
      type: String as () => DocumentType,
      required: true,
    },
    viewMode: {
      type: String as () => ViewMode,
      required: true,
    },
    hideClient: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      DocumentType,
      ViewMode,
      getDate,
      shadowDocument: {} as Document,
      mutableDocument: {} as Document,
      description: '',
    };
  },
  computed: {
    descriptionToView() {
      let text = '';
      if (this.mutableDocument.description)
        this.mutableDocument.description.forEach((i) => (text += i + '<br>'));

      return text;
    },
  },
  watch: {
    value() {
      this.setDocument();
    },
    mutableDocument: {
      handler() {
        const equal =
          JSON.stringify(this.mutableDocument) ===
          JSON.stringify(this.shadowDocument);

        if (!equal) this.$emit('input', this.mutableDocument);
      },
      deep: true,
    },
  },
  methods: {
    setDocument() {
      this.mutableDocument = getMutableDocument(this.value);
      this.shadowDocument = getMutableDocument(this.value);

      this.description = '';
      this.mutableDocument.description.forEach(
        (i) => (this.description += i + '\n')
      );
    },
    dateChanged(field: string, value: string) {
      switch (field) {
        case 'dateOfIssue':
          this.mutableDocument.dateOfIssue = this.$dayjs(
            value,
            'DD.MM.YYYY'
          ).toDate();
          this.mutableDocument.dueDate = this.$dayjs(value, 'DD.MM.YYYY')
            .add(12, 'day')
            .toDate();
          break;
        case 'dueDate':
          this.mutableDocument.dueDate = this.$dayjs(
            value,
            'DD.MM.YYYY'
          ).toDate();
          break;
      }
    },
    descriptionChanged() {
      this.mutableDocument.description = this.description.split('\n');
    },
    cashChanged() {
      this.mutableDocument.tax =
        (+this.mutableDocument.subTotal * +this.mutableDocument.taxRate) / 100;
      this.mutableDocument.total =
        +this.mutableDocument.subTotal +
        +this.mutableDocument.tax -
        +(this.mutableDocument.alreadyPaid
          ? +this.mutableDocument.alreadyPaid
          : 0);
    },
  },
});
</script>

<style lang="scss" scoped>
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
</style>
