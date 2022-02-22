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
        <div class="row w-75 d-flex justify-content-center">
          <div class="col-6">
            <button class="btn btn-warning w-100">Edit</button>
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
});
</script>

<style lang="scss" scoped>
.id {
  font-size: 0.7rem;
  opacity: 0.33;
}
</style>