<template>
  <div>
    <div class="collapse d-flex flex-column">
      <div
        class="ms-2 me-4 collapse-header d-flex align-items-center justify-content-between"
      >
        <div @click="toggleOpen">
          <slot name="header"></slot>
        </div>
        <div class="icons">
          <slot name="action"></slot>
          <button class="btn btn-link icon" @click="toggleOpen">
            <font-awesome-icon
              :icon="isOpen ? ['fas', 'chevron-up'] : ['fas', 'chevron-down']"
            />
          </button>
        </div>
      </div>
      <div class="my-3 collapse-body" :class="isOpen ? '' : 'hide'">
        <div class="d-flex justify-content-center">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AppCollapse',
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
  color: $body-text;
}

.hide {
  display: none;
}
</style>
