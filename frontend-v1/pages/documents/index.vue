<template>
  <div class="row">
    <div class="col-8 col-md-6 mb-2 p-0">
      <AppSearch :documents="store.Documents" @filtered="onFilterChanged" />
    </div>
    <div class="col text-center p-0">
      <NuxtLink
        to="/documents/create"
        class="col-8 col-md-6 btn btn-primary px-5 font-weight-bold"
      >
        {{ $t('documents.create') }}
      </NuxtLink>
    </div>
    <div class="mt-5 col-12">
      <div v-if="isLoading" class="text-center">
        <AppSpinner />
      </div>
      <div v-else>
        <template v-if="documents.length > 0">
          <DocumentItem
            v-for="doc of documents"
            :key="doc.id"
            :document="doc"
            class="mb-2"
          />
        </template>
        <template
          v-else-if="store.Documents.length > 0 && documents.length == 0"
        >
          <div class="text-center fw-bold text-danger">
            No Results could be found by the search term
          </div>
        </template>
        <template v-else>
          <div class="text-center fw-bold text-warning">
            No Documents created yet
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import DocumentModule from '~/store/document';
import { Document } from '~/models';

export default Vue.extend({
  name: 'DocumentsPage',
  data() {
    return {
      store: getModule(DocumentModule, this.$store),
      filteredList: [] as Document[],
      isLoading: false,
    };
  },
  head() {
    return {
      title: `${this.$t('title')} - ${this.$tc('document', 2)}`,
    };
  },
  computed: {
    documents: {
      get(): Document[] {
        return this.filteredList;
      },
      set(): Document[] {
        return this.filteredList;
      },
    },
  },
  watch: {
    'store.Documents'() {
      this.filteredList = this.store.Documents;
    },
  },
  mounted() {
    this.getDocuments();
  },
  methods: {
    async getDocuments() {
      this.isLoading = true;
      this.documents = await this.store.getDocuments();
      this.isLoading = false;
    },
    onFilterChanged(filteredList: Document[]) {
      this.filteredList = filteredList;
    },
  },
});
</script>
