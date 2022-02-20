<template>
  <div class="w-100">
    <div class="collapse d-flex flex-column">
      <div
        class="ml-2 mr-4 collapse-header d-flex align-items-center justify-content-between"
        @click="toggleOpen"
      >
        <slot name="header"></slot>
        <div class="icon">
          <font-awesome-icon
            :icon="isOpen ? ['fas', 'chevron-up'] : ['fas', 'chevron-down']"
          />
        </div>
      </div>
      <div class="ml-2 collapse-body" :class="isOpen ? '' : 'hide'">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ClientList',
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },
  },
});
</script>

<style lang="scss" scoped>
.collapse {
  background: $secondary-background;
  border-radius: 10px;
}

.collapse-header {
  height: 3rem;
}

.collapse-body {
  background: $secondary-background;
}

.icon {
  cursor: pointer;
}

.hide {
  display: none;
}
</style>