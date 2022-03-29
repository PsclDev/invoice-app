<template>
  <div>
    <AppCollapse>
      <template #header>
        <div class="d-flex align-items-center">
          <div>{{ client.firstname + ' ' + client.lastname }}</div>
          <div class="ml-2 id">#{{ client.id }}</div>
        </div>
      </template>
      <template #body>
        <div class="row">
          <App-Input :mode="mode"></App-Input>
        </div>
        <div class="row w-75 d-flex justify-content-center">
          <div class="col-6">
            <button
              class="btn w-100"
              :class="mode === 'view' ? 'btn-warning' : 'btn-primary'"
              @click="toggleMode"
            >
              {{ mode === 'view' ? 'Edit' : 'Save' }}
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-danger w-100">Delete</button>
          </div>
        </div>
      </template>
    </AppCollapse>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Client } from '~/models/client';

export default Vue.extend({
  name: 'ClientComponent',
  props: {
    client: {
      type: Client,
      required: true,
    },
  },
  data() {
    return {
      mode: 'view',
    };
  },
  computed: {
    fullname(): string {
      return `${this.client.firstname} ${this.client.lastname}`;
    },
    fullcity(): string {
      return `${this.client.postalCode} ${this.client.city}`;
    },
  },
  methods: {
    toggleMode() {
      this.mode = this.mode === 'view' ? 'edit' : 'view';
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