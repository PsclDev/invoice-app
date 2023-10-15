<script lang="ts" setup>
import { reset } from '@formkit/core';
import { omit } from 'lodash';
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
const docHelper = useDocumentHelper();
const randomValue = useRandomValue();

const formId = randomValue.Id();
const form = reactive<DocumentForm>({
  type: DocumentType.OFFER,
  offerNr: 0,
  invoiceNr: 0,
  dateOfIssue: DateTime.now().toFormat(docHelper.dateFormat),
  description: '',
  subTotal: 0,
  tax: 0,
  taxRate: 19,
  total: 0,
  alreadyPaid: 0,
  dueDate: DateTime.now().plus({ days: 8 }).toFormat(docHelper.dateFormat),
});

const dateDifference = computed(() => {
  return docHelper.dateDifference(form.dateOfIssue, form.dueDate);
});

const document = ref<Document | null>(null);
if (formMode.value === FormMode.EDIT) {
  document.value = await store.getById(documentId.value);
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
      docHelper.dateFormat,
    ),
    dueDate: DateTime.fromISO(document.value.dueDate).toFormat(
      docHelper.dateFormat,
    ),
    alreadyPaid: document.value.alreadyPaid || 0,
  };

  Object.assign(form, unformattedValues, formattedValues);
}

watch(
  () => form.dateOfIssue,
  (newDateOfIssue, oldDateOfIssue) => {
    if (oldDateOfIssue !== newDateOfIssue) {
      form.dueDate = docHelper.getDueDate(newDateOfIssue);
    }
  },
);

watchDebounced(
  () => form.description,
  () => {
    const calculated = docHelper.calculateSubtotal(form.description);
    form.subTotal = calculated > 0 ? calculated : form.subTotal;
  },
  { debounce: 450 },
);

watchDebounced(
  () => form.subTotal + form.taxRate + form.alreadyPaid,
  () => {
    const tax = form.subTotal * (form.taxRate / 100);
    const total = Number(form.subTotal) + tax - Number(form.alreadyPaid);

    Object.assign(form, {
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
    });
  },
  { debounce: 250 },
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
  <FormKit
    :id="formId"
    v-slot="{ state: { valid: formIsValid } }"
    v-model="form"
    type="form"
    :actions="false"
    form-class="w-full"
  >
    <div class="flex w-full flex-col items-center justify-center gap-5">
      <div class="flex w-full flex-col gap-5">
        <AppGroup>
          <AppFormInput label="DOCUMENTS.LABELS.DATE_OF_ISSUE" :required="true">
            <FormKit type="date" name="dateOfIssue" validation="required" />
          </AppFormInput>
          <AppFormInput
            v-if="document && docHelper.isInvoice(document)"
            label="DOCUMENTS.LABELS.DUE_DATE"
            :required="true"
          >
            <FormKit type="date" name="dueDate" validation="required" />
          </AppFormInput>
          <div
            v-if="document && docHelper.isInvoice(document)"
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
          <AppFormInput label="DOCUMENTS.LABELS.DESCRIPTION" :required="true">
            <FormKit
              type="textarea"
              name="description"
              validation="required"
              rows="10"
            />
          </AppFormInput>
        </div>

        <div class="grid w-full gap-2 sm:grid-cols-4">
          <AppFormInput label="DOCUMENTS.LABELS.SUBTOTAL" :required="true">
            <FormKit
              type="number"
              number="float"
              name="subTotal"
              validation="required"
            />
          </AppFormInput>
          <AppFormInput label="DOCUMENTS.LABELS.TAX_RATE" :required="true">
            <FormKit
              type="number"
              number="float"
              name="taxRate"
              validation="required"
            />
          </AppFormInput>
          <AppFormInput label="DOCUMENTS.LABELS.TAX" :required="true">
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
            v-if="document && docHelper.isInvoice(document)"
            label="DOCUMENTS.LABELS.ALREADY_PAID"
          >
            <FormKit type="number" number="float" name="alreadyPaid" />
          </AppFormInput>
          <AppFormInput label="DOCUMENTS.LABELS.TOTAL" :required="true">
            <FormKit
              type="number"
              number="float"
              name="total"
              validation="required"
            />
          </AppFormInput>
        </div>
      </div>
      <div class="flex w-full gap-5">
        <AppButton
          label="COMMON.BUTTONS.CANCEL"
          :color="ButtonColor.GRAY"
          @click="onCancel"
        />
        <AppButton
          label="COMMON.BUTTONS.SAVE"
          :disabled="!formIsValid"
          @click="onSave"
        />
      </div>
    </div>
  </FormKit>
</template>
