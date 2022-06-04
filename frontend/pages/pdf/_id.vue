<template>
  <div v-if="!isLoading" class="page" size="A4">
    <div class="content"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getModule } from 'vuex-module-decorators';
import * as Mustache from 'mustache';
import ClientModule from '~/store/client';
import DocumentModule from '~/store/document';
import SettingModule from '~/store/setting';
import { Client, Document } from '~/models';
import { SettingType } from '~/types';
import { getDate } from '~/utils/helper';

export default Vue.extend({
  name: 'PrintPage',
  layout: 'print',
  data() {
    return {
      getDate,
      isLoading: true,
      clientStore: getModule(ClientModule, this.$store),
      documentStore: getModule(DocumentModule, this.$store),
      settingStore: getModule(SettingModule, this.$store),
      client: {} as Client,
      document: {} as Document,
      settings: {} as any,
    };
  },
  computed: {
    isInvoice(): boolean {
      return !!this.document.invoiceNr;
    },
  },
  mounted() {
    const { params } = this.$route;
    this.getDocument(params.id);
  },
  methods: {
    async getDocument(id: string) {
      this.isLoading = true;
      this.document = await this.documentStore.getDocumentById(id);
      this.client = await this.clientStore.getClientById(
        this.document.clientId
      );
      await (
        await this.settingStore.getSettings()
      )
        .filter((s) => s.type === SettingType.PDF)
        .forEach((s) => {
          this.settings[s.key] = s.value;
        });

      this.isLoading = false;
      console.log('Data', this.document, this.client, this.settings);
    },
    convertTemplate(key: string): string {
      return Mustache.render(`{{${key}}}`, {
        ...this.client,
        ...this.document,
        ...this.settings,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.page {
  background: white;
  font-size: 12pt;
  font-family: 'Cousine', monospace;
  color: black;
}

.page[size='A4'] {
  width: 21cm;
  height: 29.7cm;
}
.page[size='A4'][direction='landscape'] {
  width: 29.7cm;
  height: 21cm;
}
.content {
  padding: 4.5cm 1cm 1cm 2.5cm;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
