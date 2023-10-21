<script lang="ts" setup>
import { DateTime } from 'luxon';

import { DocumentForm, DocumentType } from '~/types';

const props = defineProps({
  modelValue: {
    type: Object as PropType<DocumentForm>,
    required: true,
  },
});

const aiStore = useAiStore();
const emits = defineEmits(['update:modelValue']);
const { modelValue } = toRefs(props);
const docHelper = useDocumentHelper();
const randomValue = useRandomValue();

const formId = randomValue.Id();
const form = ref({ ...modelValue.value });

async function optimizeDescription() {
  form.value.description = await aiStore.optimizeDescription(
    form.value.description,
  );
}

const dateDifference = computed(() => {
  return docHelper.dateDifference(form.value.dateOfIssue, form.value.dueDate);
});

watch(
  () => form.value.type,
  () => {
    if (form.value.type === DocumentType.INVOICE) {
      form.value.dueDate = DateTime.fromISO(form.value.dateOfIssue)
        .plus({ days: 8 })
        .toFormat(docHelper.dateFormat);
    }
  },
);

watch(
  () => form.value.dateOfIssue,
  (newDateOfIssue, oldDateOfIssue) => {
    if (oldDateOfIssue !== newDateOfIssue) {
      form.value.dueDate = docHelper.getDueDate(newDateOfIssue);
    }
  },
);

watchDebounced(
  () => form.value.description,
  () => {
    const calculated = docHelper.calculateSubtotal(form.value.description);
    form.value.subTotal = calculated > 0 ? calculated : form.value.subTotal;
  },
  { debounce: 450 },
);

watchDebounced(
  () => form.value.subTotal + form.value.taxRate + form.value.alreadyPaid,
  () => {
    const tax = form.value.subTotal * (form.value.taxRate / 100);
    const total =
      Number(form.value.subTotal) +
      Number(tax) -
      Number(form.value.alreadyPaid);

    form.value.tax = Number(tax.toFixed(2));
    form.value.total = Number(total.toFixed(2));
  },
  { debounce: 250 },
);

watchDebounced(
  form.value,
  () => {
    emits('update:modelValue', form.value);
  },
  { debounce: 450 },
);
</script>

<template>
  <FormKit
    :id="formId"
    v-model="form"
    type="form"
    :actions="false"
    form-class="w-full"
  >
    <div class="flex w-full flex-col gap-5">
      <AppGroup>
        <AppFormInput label="CLIENTS.LABELS.TYPE">
          <FormKit
            name="type"
            type="radio"
            :options="{
              [DocumentType.OFFER]: $t('DOCUMENTS.TYPE.OFFER'),
              [DocumentType.INVOICE]: $t('DOCUMENTS.TYPE.INVOICE'),
            }"
          />
        </AppFormInput>
      </AppGroup>
      <AppGroup>
        <AppFormInput label="DOCUMENTS.LABELS.DATE_OF_ISSUE" :required="true">
          <FormKit type="date" name="dateOfIssue" validation="required" />
        </AppFormInput>
        <AppFormInput
          v-if="form.type === DocumentType.INVOICE"
          label="DOCUMENTS.LABELS.DUE_DATE"
          :required="true"
        >
          <FormKit type="date" name="dueDate" validation="required" />
        </AppFormInput>
        <div
          v-if="form.type === DocumentType.INVOICE"
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
        <div v-if="form.description.length > 0" class="w-48">
          <button
            type="button"
            class="rounded border border-cannon-pink-500 bg-transparent px-2 py-1 text-xs text-cannon-pink-700"
            @click="optimizeDescription"
          >
            {{ $t('DOCUMENTS.OPTIMIZE_DESCRIPTION') }}
          </button>
        </div>
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
          v-if="form.type === DocumentType.INVOICE"
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
  </FormKit>
</template>
