<template>
  <div class="custom-card col-12 px-3">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AppCard',
});
</script>

<style lang="scss" scoped>
.custom-card {
  background: $secondary-background;
  border-radius: 10px;
}
</style>
