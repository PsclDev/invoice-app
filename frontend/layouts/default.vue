<template>
  <div>
    <TheNavbar />
    <div class="container-fluid mb-5">
      <Nuxt />
    </div>
    <TheFooter />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DefaultLayout',
});
</script>

<style lang="scss" scoped>
div {
  width: 100%;
  height: 100%;
  margin-top: 1rem;

  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
