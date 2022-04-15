<template>
  <div class="row">
    <div class="col-8 col-md-6 mb-2">
      <AppSearch :documents="store.Documents" @filtered="onFilterChanged" />
    </div>
    <div class="col text-center">
      <button
        class="col-8 col-md-6 btn btn-primary px-5 font-weight-bold"
        @click="create"
      >
        {{ $t('documents.create') }}
      </button>
    </div>
    <div class="mt-5 col-12">
      <div v-if="isLoading" class="text-center">
        <AppSpinner />
      </div>
      <div v-else>
        <div v-for="doc of documents" :key="doc.id" class="mb-2">
          <Document :document="doc" />
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

export default Vue.extend({
  name: 'DocumentsPage',
  data() {
    return {
      store: getModule(DocumentModule, this.$store),
      filteredList: [] as Document[],
      isLoading: false,
    };
  },
  computed: {
    documents(): Document[] {
      return this.filteredList;
    },
  },
  mounted() {
    this.getDocuments();
  },
  methods: {
    async getDocuments() {
      this.isLoading = true;
      await this.store.getDocuments();
      this.isLoading = false;
    },
    create() {
      // TODO
      // this.store.createClient();
    },
    onFilterChanged(filteredList: Document[]) {
      this.filteredList = filteredList;
    },
  },
});
</script>
