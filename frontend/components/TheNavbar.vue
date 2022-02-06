<template>
  <div>
    <div class="navbar w-50">
      <NuxtLink to="/" exact class="nav-item">{{ $t('home') }}</NuxtLink>
      <NuxtLink to="/clients" exact class="nav-item">{{
        $tc('client', 2)
      }}</NuxtLink>
      <NuxtLink to="/documents" exact class="nav-item">{{
        $tc('document', 2)
      }}</NuxtLink>

      <span class="icon" @click="switchLanguage">
        <font-awesome-icon :icon="['fas', 'language']" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mounted() {
    const locale = this.$i18n.getLocaleCookie() === 'en' ? 'de' : 'en'
    this.$i18n.setLocale(locale)
  },
  methods: {
    switchLanguage(): void {
      const locale = this.$i18n.getLocaleCookie() === 'en' ? 'de' : 'en'
      this.$i18n.setLocale(locale)
    },
  },
})
</script>


<style scoped lang="scss">
.navbar {
  background: $lightblue;
  border-radius: 10px;
  font-size: 1.2rem;
}

.nav-item {
  color: $white;
  text-decoration: none;
}

a.nuxt-link-active {
  font-weight: bold;
  @include gradientText;
}
</style>