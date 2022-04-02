<template>
  <div class="spinner">
    <div></div>
    <div></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TheAppSpinner',
});
</script>

<style lang="scss" scoped>
.spinner {
  display: inline-block;
  position: relative;
  width: 72px;
  height: 72px;
}
.spinner div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: spinner 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.spinner div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes spinner {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
