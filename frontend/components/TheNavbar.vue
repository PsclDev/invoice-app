<template>
  <div class="no-select d-flex justify-content-center">
    <div class="navbar px-3 w-50">
      <NuxtLink to="/" exact class="nav-item">
        <font-awesome-icon class="link-icon" :icon="['fas', 'chart-pie']" />
        <span>{{ $t('home') }}</span>
      </NuxtLink>

      <NuxtLink to="/clients" exact class="nav-item">
        <font-awesome-icon class="link-icon" :icon="['fas', 'users']" />
        <span>{{ $tc('client', 2) }}</span>
      </NuxtLink>
      <NuxtLink to="/documents" exact class="nav-item">
        <font-awesome-icon class="link-icon" :icon="['fas', 'file-invoice']" />
        <span>{{ $tc('document', 2) }}</span>
      </NuxtLink>
    </div>

    <div class="actionbar-lt" @click="switchLanguage">
      <font-awesome-icon :icon="['fas', 'language']" />
    </div>

    <div class="actionbar-rt" @click="switchTheme">
      <font-awesome-icon :icon="darkMode ? ['fas', 'sun'] : ['fas', 'moon']" />
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
      if (!this.isDarkMode)
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
  @include gradientPrimaryText;
}

.link-icon {
  display: none;
}

.actionbar-lt {
  position: absolute;
  left: 20px;
  font-size: 1.6rem;
  cursor: pointer;
}

.actionbar-rt {
  position: absolute;
  right: 20px;
  font-size: 1.6rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .navbar {
    font-size: 2.5rem;
  }

  span {
    display: none;
  }

  .link-icon {
    display: unset;
  }

  a.nuxt-link-active {
    .link-icon {
      color: $green;
    }
  }
}
</style>
