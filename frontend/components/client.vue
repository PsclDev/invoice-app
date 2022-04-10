<template>
  <div>
    <AppCollapse>
      <template #header>
        <div class="d-flex align-items-center">
          <font-awesome-icon
            class="me-2"
            :icon="['fa', isCompany() ? 'user-tie' : 'user']"
          />
          <div class="d-flex">
            <div>
              {{ fullname }}
            </div>
            <div v-if="isCompany()" class="d-none d-lg-block ms-1">
              {{ ' | ' + company }}
            </div>
          </div>
          <div class="ms-2 id">#{{ client.id }}</div>
        </div>
      </template>
      <template #body>
        <div class="container">
          <template v-if="isCompany() || mode === 'edit'">
            <div class="row mb-4">
              <App-Input
                v-model="mutableClient.company"
                class="col-sm-4"
                :title="$t('clients.company')"
                :mode="mode"
              ></App-Input>
              <App-Input
                v-model="mutableClient.vat"
                class="col-sm-4"
                :title="$t('clients.vat')"
                :mode="mode"
              ></App-Input>
            </div>
          </template>
          <div class="row mb-4">
            <App-Gender-Select
              v-if="mutableClient.gender"
              v-model="mutableClient.gender"
              class="col-sm-4"
              :title="$t('clients.gender')"
              :mode="mode"
            ></App-Gender-Select>
            <App-Input
              v-model="mutableClient.firstname"
              class="col-sm-4"
              :title="$t('clients.firstname')"
              :mode="mode"
            ></App-Input>
            <App-Input
              v-model="mutableClient.lastname"
              class="col-sm-4"
              :title="$t('clients.lastname')"
              :mode="mode"
            ></App-Input>
          </div>
          <div class="row mb-4">
            <App-Input
              v-model="mutableClient.street"
              class="col-sm-4"
              :title="$t('clients.street')"
              :mode="mode"
            ></App-Input>
            <App-Input
              v-model="mutableClient.postalCode"
              class="col-sm-4"
              :title="$t('clients.postalCode')"
              :mode="mode"
            ></App-Input>
            <App-Input
              v-model="mutableClient.city"
              class="col-sm-4"
              :title="$t('clients.city')"
              :mode="mode"
            ></App-Input>
          </div>
          <div class="row mb-4">
            <App-Input
              v-model="mutableClient.email"
              class="col-sm-4"
              :mode="mode"
              :title="$t('clients.email')"
              type="email"
            ></App-Input>
          </div>
          <div class="row mb-4">
            <div class="col-3">
              <div
                v-if="documentsLength === 0"
                class="d-flex align-items-center"
              >
                <font-awesome-icon class="me-2" :icon="['fa', 'file-pdf']" />
                <div>
                  {{ documentsLength }}
                  {{ $tc('document', 2) }}
                </div>
              </div>
              <AppCollapse v-else>
                <template #header>
                  <div class="d-flex align-items-center">
                    <font-awesome-icon
                      class="me-2"
                      :icon="['fa', 'file-pdf']"
                    />
                    <div>
                      {{ documentsLength }}
                      {{ $tc('document', documentsLength === 1 ? 1 : 2) }}
                    </div>
                  </div>
                </template>
                <template #body>
                  <ul>
                    <li v-for="doc of documents" :key="doc.id">
                      <NuxtLink :to="'/pdf/' + doc.id">
                        {{ getDocumentTitle(doc) }}
                      </NuxtLink>
                    </li>
                  </ul>
                </template>
              </AppCollapse>
            </div>
          </div>
          <div v-if="!confirmDelete" class="row">
            <div class="col-4 offset-2">
              <button
                v-if="mode === 'view'"
                class="btn btn-info w-100"
                @click="edit"
              >
                {{ $t('button.edit') }}
              </button>
              <button v-else class="btn btn-primary w-100" @click="save">
                {{ $t('button.save') }}
              </button>
            </div>
            <div class="col-4">
              <button
                v-if="mode === 'view'"
                class="btn btn-danger w-100"
                :disabled="documentsLength > 0"
                @click="deleteClient"
              >
                {{ $t('button.delete') }}
              </button>
              <button v-else class="btn btn-warning w-100" @click="cancel">
                {{ $t('button.cancel') }}
              </button>
            </div>
          </div>

          <div v-else class="row">
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
import { getModule } from 'vuex-module-decorators';
import ClientModule from '~/store/client';
import { Client } from '~/models/client';
import { Document } from '~/models/document';

export default Vue.extend({
  name: 'ClientComponent',
  props: {
    client: {
      type: Object as () => Client,
      required: true,
    },
  },
  data() {
    return {
      store: getModule(ClientModule, this.$store),
      mode: 'view',
      confirmDelete: false,
      mutableClient: {} as Client,
    };
  },
  computed: {
    fullname(): string {
      return `${this.mutableClient.firstname} ${this.mutableClient.lastname}`;
    },
    company(): string {
      return `${this.mutableClient.company} - VAT. ${this.mutableClient.vat}`;
    },
    documents(): Document[] {
      return this.client.documents;
    },
    documentsLength(): number {
      return this.client.documents ? this.client.documents.length : 0;
    },
  },
  mounted() {
    this.setClient();
  },
  methods: {
    setClient() {
      this.mutableClient = {
        id: this.client.id,
        company: this.client.company,
        vat: this.client.vat,
        gender: this.client.gender,
        firstname: this.client.firstname,
        lastname: this.client.lastname,
        email: this.client.email,
        street: this.client.street,
        postalCode: this.client.postalCode,
        city: this.client.city,
      } as Client;
    },
    isCompany() {
      return this.client.company;
    },
    getDocumentTitle(doc: Document) {
      if (doc.invoiceNr) {
        return `${this.$t('documents.invoice')} #${String(
          doc.invoiceNr
        ).padStart(4, '0')}`;
      } else {
        return `${this.$t('documents.offer')} ${this.$moment(
          doc.dateOfIssue
        ).format('DD.MM.YYYY')}`;
      }
    },
    edit() {
      this.mode = 'edit';
    },
    save() {
      if (this.mutableClient.id) this.store.updateClient(this.mutableClient);
      else this.store.saveNewClient(this.mutableClient);
      this.mode = 'view';
    },
    cancel() {
      this.confirmDelete = false;
      this.setClient();
      this.mode = 'view';
    },
    deleteClient() {
      this.confirmDelete = true;
    },
    deleteConfirm() {
      this.store.deleteClient(this.mutableClient);
    },
  },
});
</script>

<style lang="scss" scoped>
.id {
  font-size: 0.7rem;
  opacity: 0.33;
}
</style>
