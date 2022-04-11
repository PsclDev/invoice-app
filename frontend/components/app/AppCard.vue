<template>
  <div>
    <AppCollapse>
      <template #header>
        <slot name="header"></slot>
      </template>
      <template #body>
        <div class="container">
          <slot name="body"></slot>

          <div v-show="viewMode == ViewMode.SHOW" class="row">
            <div class="col-4 offset-2">
              <button class="btn btn-info w-100" @click="edit">
                {{ $t('button.edit') }}
              </button>
            </div>
            <div class="col-4">
              <button
                class="btn btn-danger w-100"
                :disabled="deleteDisbaled"
                @click="deleteStart"
              >
                {{ $t('button.delete') }}
              </button>
            </div>
          </div>

          <div v-show="viewMode === ViewMode.EDIT" class="row">
            <div class="col-4 offset-2">
              <button class="btn btn-primary w-100" @click="save">
                {{ $t('button.save') }}
              </button>
            </div>
            <div class="col-4">
              <button class="btn btn-warning w-100" @click="cancel">
                {{ $t('button.cancel') }}
              </button>
            </div>
          </div>

          <div v-show="viewMode === ViewMode.DELETE" class="row">
            <div class="col-4 offset-2">
              <button class="btn btn-danger w-100" @click="deleteConfirm">
                {{ $t('button.delete_confirm') }}
              </button>
            </div>
            <div class="col-4">
              <button class="btn btn-warning w-100" @click="cancel">
                {{ $t('button.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </AppCollapse>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ViewMode from '~/types/viewMode';

export default Vue.extend({
  name: 'AppCard',
  props: {
    deleteDisbaled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ViewMode,
      viewMode: ViewMode.SHOW,
    };
  },
  methods: {
    edit() {
      this.viewMode = ViewMode.EDIT;
      this.$emit('edit', this.viewMode);
    },
    save() {
      this.viewMode = ViewMode.SHOW;
      this.$emit('save', this.viewMode);
    },
    cancel() {
      this.viewMode = ViewMode.SHOW;
      this.$emit('cancel', this.viewMode);
    },
    deleteStart() {
      this.viewMode = ViewMode.DELETE;
    },
    deleteConfirm() {
      this.$emit('delete');
    },
  },
});
</script>
