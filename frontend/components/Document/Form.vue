<script lang="ts" setup>
import { reset } from '@formkit/core';
import { debounce, omit } from 'lodash';
import { DateTime } from 'luxon';

import {
  ButtonColor,
  Document,
  DocumentForm,
  DocumentType,
  FormMode,
  ViewMode,
} from '~/types';

const props = defineProps({
  modelValue: {
    type: String as PropType<ViewMode>,
    required: true,
  },
  formMode: {
    type: String as PropType<FormMode>,
    required: true,
  },
  documentId: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue']);

const store = useDocumentStore();
const { modelValue, formMode, documentId } = toRefs(props);
const { isInvoice } = useDocumentHelper();

const formId = (Math.random() + 1).toString(36).substring(7);
const dateFormat = 'yyyy-MM-dd';
const form = reactive<DocumentForm>({
  type: DocumentType.OFFER,
  offerNr: 0,
  invoiceNr: 0,
  dateOfIssue: DateTime.now().toFormat(dateFormat),
  description: '',
  subTotal: 0,
  tax: 19,
  taxRate: 0,
  total: 0,
  alreadyPaid: 0,
  dueDate: DateTime.now().plus({ days: 8 }).toFormat(dateFormat),
});

const dateDifference = computed(() => {
  const dateOfIssue = DateTime.fromISO(form.dateOfIssue);
  const dueDate = DateTime.fromISO(form.dueDate);

  return dueDate.diff(dateOfIssue, 'days').days;
});

const document = ref<Document | null>(null);
if (formMode.value === FormMode.EDIT) {
  document.value = store.getById(documentId.value);
  const unformattedValues = omit(document.value, [
    'id',
    'description',
    'dateOfIssue',
    'dueDate',
    'createdAt',
    'updatedAt',
  ]);

  const formattedValues = {
    description: document.value.description.join('\n'),
    dateOfIssue: DateTime.fromISO(document.value.dateOfIssue).toFormat(
      dateFormat,
    ),
    dueDate: DateTime.fromISO(document.value.dueDate).toFormat(dateFormat),
  };

  Object.assign(form, unformattedValues, formattedValues);
}

watch(
  form,
  debounce(() => {
    const tax = form.subTotal * (form.taxRate / 100);
    const total = Number(form.subTotal) + tax - Number(form.alreadyPaid);

    Object.assign(form, {
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
    });
  }, 300),
);

function onSave() {
  store.update(documentId.value, form);

  emits(
    'update:modelValue',
    modelValue.value === ViewMode.EDIT ? ViewMode.VIEW : ViewMode.EDIT,
  );
}

function onCancel() {
  reset(formId);
  emits(
    'update:modelValue',
    modelValue.value === ViewMode.EDIT ? ViewMode.VIEW : ViewMode.EDIT,
  );
}
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center gap-5">
    <FormKit
      :id="formId"
      v-model="form"
      type="form"
      :actions="false"
      form-class="w-full"
    >
      <div class="flex w-full flex-col gap-5">
        <AppGroup>
          <AppFormInput label="DOCUMENTS.LABELS.DATE_OF_ISSUE">
            <FormKit type="date" name="dateOfIssue" validation="required" />
          </AppFormInput>
          <AppFormInput
            v-if="document && isInvoice(document)"
            label="DOCUMENTS.LABELS.DUE_DATE"
          >
            <FormKit type="date" name="dueDate" validation="required" />
          </AppFormInput>
          <div
            v-if="document && isInvoice(document)"
            class="flex w-full flex-col justify-center sm:gap-2"
          >
            <p class="font-bold">{{ $t('DOCUMENTS.LABELS.DATE_DIFF') }}:</p>
            <p
              class="font-bold"
              :class="
                dateDifference >= 0 ? 'text-spring-green-600' : 'text-red-600'
              "
            >
              {{ dateDifference }}
            </p>
          </div>
        </AppGroup>

        <div class="grid w-full grid-cols-1 gap-2">
          <AppFormInput label="DOCUMENTS.LABELS.DESCRIPTION">
            <FormKit
              type="textarea"
              name="description"
              validation="required"
              rows="10"
            />
          </AppFormInput>
        </div>

        <div class="grid w-full gap-2 sm:grid-cols-4">
          <AppFormInput label="DOCUMENTS.LABELS.SUBTOTAL">
            <FormKit
              type="number"
              number="float"
              name="subTotal"
              validation="required"
            />
          </AppFormInput>
          <AppFormInput label="DOCUMENTS.LABELS.TAX_RATE">
            <FormKit
              type="number"
              number="float"
              name="taxRate"
              validation="required"
            />
          </AppFormInput>
          <AppFormInput label="DOCUMENTS.LABELS.TAX">
            <FormKit
              type="number"
              number="float"
              name="tax"
              validation="required"
            />
          </AppFormInput>
        </div>
        <div class="grid w-full gap-2 sm:grid-cols-4">
          <AppFormInput
            v-if="document && isInvoice(document)"
            label="DOCUMENTS.LABELS.ALREADY_PAID"
          >
            <FormKit
              type="number"
              number="float"
              name="alreadyPaid"
              validation="required"
            />
          </AppFormInput>
          <AppFormInput label="DOCUMENTS.LABELS.TOTAL">
            <FormKit
              type="number"
              number="float"
              name="total"
              validation="required"
            />
          </AppFormInput>
        </div>
      </div>
    </FormKit>
    <div class="flex w-full gap-5">
      <AppButton
        label="COMMON.BUTTONS.CANCEL"
        :color="ButtonColor.GRAY"
        @click="onCancel"
      />
      <AppButton label="COMMON.BUTTONS.SAVE" @click="onSave" />
    </div>
  </div>
</template>