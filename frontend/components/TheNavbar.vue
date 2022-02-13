<template>
  <div class="no-select">
    <div class="navbar w-50">
      <NuxtLink to="/" exact class="nav-item">
        <span class="icon" @click="switchLanguage">
          <font-awesome-icon :icon="['fas', 'chart-pie']" />
        </span>
        {{ $t('home') }}
      </NuxtLink>

      <NuxtLink to="/clients" exact class="nav-item">
        <font-awesome-icon :icon="['fas', 'users']" />
        {{ $tc('client', 2) }}</NuxtLink
      >
      <NuxtLink to="/documents" exact class="nav-item">
        <font-awesome-icon :icon="['fas', 'file-invoice']" />
        {{ $tc('document', 2) }}</NuxtLink
      >
    </div>

    <div class="actionbar">
      <span class="icon mr-3" @click="switchLanguage">
        <font-awesome-icon :icon="['fas', 'language']" />
      </span>

      <span class="icon" @click="switchTheme">
        <font-awesome-icon
          :icon="darkMode ? ['fas', 'sun'] : ['fas', 'moon']"
        />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'TheHeader',
  data() {
    return {
      THEME_LS_KEY: 'APP_THEME',
      isDarkMode: true,
    };
  },
  computed: {
    darkMode(): boolean {
      return this.isDarkMode;
    },
  },
  mounted() {
    const theme = localStorage.getItem(this.THEME_LS_KEY);
    if (theme) {
      this.isDarkMode = theme === 'dark';
      document.querySelector('body')!.classList.toggle('light');
    } else {
      localStorage.setItem(this.THEME_LS_KEY, 'dark');
    }

    const locale = this.$i18n.getLocaleCookie() === 'en' ? 'de' : 'en';
    this.$i18n.setLocale(locale);
  },
  methods: {
    switchLanguage(): void {
      const locale = this.$i18n.getLocaleCookie() === 'en' ? 'de' : 'en';
      this.$i18n.setLocale(locale);
    },
    switchTheme(): void {
      this.isDarkMode = !this.isDarkMode;
      const theme = this.isDarkMode ? 'dark' : 'light';
      localStorage.setItem(this.THEME_LS_KEY, theme);
      document.querySelector('body')!.classList.toggle('light');
    },
  },
});
</script>

<style scoped lang="scss">
.navbar {
  background: $secondary-background;
  border-radius: 10px;
  font-size: 1.2rem;
}

.nav-item {
  color: $body-text;
  text-decoration: none;
}

a.nuxt-link-active {
  font-weight: bold;
  @include gradientText;
}

.actionbar {
  position: absolute;
  right: 20px;
  font-size: 1.6rem;

  .icon {
    cursor: pointer;
  }
}
</style>
