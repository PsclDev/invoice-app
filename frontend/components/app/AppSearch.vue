<template>
  <div class="input-box">
    <input v-model="searchTerm" type="text" class="form-control" />
    <i>
      <font-awesome-icon :icon="['fas', 'search']" />
    </i>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Client, Document, Setting } from '~/models';

export default Vue.extend({
  name: 'AppSearch',
  props: {
    clients: {
      type: Array as () => Client[],
      default: undefined,
    },
    documents: {
      type: Array as () => Document[],
      default: undefined,
    },
    settings: {
      type: Array as () => Setting[],
      default: undefined,
    },
  },
  data() {
    return {
      searchTerm: '',
    };
  },
  watch: {
    searchTerm() {
      const term = this.searchTerm.toLowerCase();
      if (this.clients) {
        const filtered = this.clients.filter((c) => {
          return this.checkForValue(c, term);
        });

        this.$emit('filtered', filtered);
      } else if (this.documents) {
        const filtered = this.documents.filter((d) => {
          return this.checkForValue(d, term);
        });

        this.$emit('filtered', filtered);
      } else if (this.settings) {
        const filtered = this.settings.filter((s) => {
          return this.checkForValue(s, term);
        });

        this.$emit('filtered', filtered);
      } else {
        throw new Error('AppSearch has undefined props');
      }
    },
  },
  mounted() {
    if (this.clients) this.$emit('filtered', this.clients);
    else if (this.documents) this.$emit('filtered', this.documents);
    else if (this.settings) this.$emit('filtered', this.settings);
    else throw new Error('AppSearch has undefined props');
  },
  methods: {
    checkForValue(obj: Client | Document | Setting, term: string): boolean {
      for (const key in obj) {
        const val = (obj as any)[key];
        if (
          typeof val === 'string' &&
          val.toLowerCase().includes(term.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    },
  },
});
</script>

<style lang="scss" scoped>
.input-box {
  position: relative;
  color: --body-text;
}

.input-box i {
  position: absolute;
  right: 13px;
  top: 15px;
}

.form-control {
  color: --body-text;
  height: 50px;
  background-color: $secondary-background;
  border-color: $secondary-background;
}
</style>
