<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Object as PropType<ClientForm>,
    required: true,
  },
});

const emits = defineEmits(['update:modelValue']);
const { modelValue } = toRefs(props);
const randomValue = useRandomValue();

const formId = randomValue.Id();
const clientType = ref<'private' | 'company'>('private');
const form = ref({ ...modelValue.value });

watch(form, () => {
  emits('update:modelValue', form.value);
});
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
            v-model="clientType"
            type="radio"
            :options="{
              private: $t('CLIENTS.TYPE.PRIVATE'),
              company: $t('CLIENTS.TYPE.COMPANY'),
            }"
          />
        </AppFormInput>
        <AppFormInput
          v-if="clientType === 'company'"
          label="CLIENTS.LABELS.COMPANY"
          :required="true"
        >
          <FormKit type="text" name="company" validation="required" />
        </AppFormInput>
        <AppFormInput
          v-if="clientType === 'company'"
          label="CLIENTS.LABELS.VAT"
          :required="true"
        >
          <FormKit type="text" name="vat" validation="required" />
        </AppFormInput>
      </AppGroup>

      <AppGroup>
        <AppFormInput label="CLIENTS.LABELS.GENDER" :required="true">
          <FormKit
            type="select"
            name="gender"
            validation="required"
            :options="{
              MALE: $t('CLIENTS.GENDER.MALE'),
              FEMALE: $t('CLIENTS.GENDER.FEMALE'),
              DIVERS: $t('CLIENTS.GENDER.DIVERS'),
            }"
          />
        </AppFormInput>
        <AppFormInput label="CLIENTS.LABELS.FIRSTNAME" :required="true">
          <FormKit type="text" name="firstname" validation="required" />
        </AppFormInput>
        <AppFormInput label="CLIENTS.LABELS.LASTNAME" :required="true">
          <FormKit type="text" name="lastname" validation="required" />
        </AppFormInput>
      </AppGroup>

      <AppGroup>
        <AppFormInput label="CLIENTS.LABELS.STREET" :required="true">
          <FormKit type="text" name="street" validation="required" />
        </AppFormInput>
        <AppFormInput label="CLIENTS.LABELS.POSTAL_CODE" :required="true">
          <FormKit type="text" name="postalCode" validation="required" />
        </AppFormInput>
        <AppFormInput label="CLIENTS.LABELS.CITY" :required="true">
          <FormKit type="text" name="city" validation="required" />
        </AppFormInput>
      </AppGroup>

      <AppGroup>
        <AppFormInput label="CLIENTS.LABELS.EMAIL">
          <FormKit type="email" name="email" validation="email" />
        </AppFormInput>
      </AppGroup>
    </div>
  </FormKit>
</template>
~/models
