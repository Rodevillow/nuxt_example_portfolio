export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "configurator",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [{ src: "assets/styles/global.scss", lang: "scss" }],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/validator",
    "~/plugins/axios",
    "~/plugins/datepicker",
    "~/plugins/timepicker",
    "~/plugins/directives",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["@nuxt/typescript-build"],

  // Router
  router: {
    // middleware: ["auth"]
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // Application core
    "nuxt-i18n",
    "~/modules/fraestechnik/index.ts",
    // https://go.nuxtjs.dev/bootstrap
    "bootstrap-vue/nuxt",
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/moment",
    // https://www.npmjs.com/package/@nuxtjs/style-resources
    "@nuxtjs/style-resources",
    // https://www.npmjs.com/package/vue-toastification
    "vue-toastification/nuxt",
    // https://auth.nuxtjs.org/guide/setup
    "@nuxtjs/auth-next",
    [
      "@nuxtjs/recaptcha",
      {
        siteKey: "<your_key>",
        size: "invisible",
        hideBadge: false,
        version: 2,
      },
    ],
  ],
  i18n: {
    detectBrowserLanguage: false,
    locales: ["de"],
    vueI18n: {
      fallbackLocale: "de",
      messages: {
        de: require("./lang/de.json"),
      },
    },
    defaultLocale: "de",
    strategy: "prefix_except_default",
  },
  auth: {
    localStorage: false,
    cookie: {
      options: {
        prefix: "auth_",
        secure: true,
      },
    },
    strategies: {
      local: {
        scheme: "refresh",
        token: {
          required: true,
          type: "Bearer",
          global: true,
        },
        refreshToken: {
          property: "refresh_token",
          data: "refresh_token",
          maxAge: 60 * 60 * 24 * 1,
        },
        endpoints: {
          login: { url: "auth/signin", method: "post", propertyName: "token" },
          refresh: { url: "auth/refresh", method: "post" },
          user: { url: "users/me", method: "get", propertyName: false },
          logout: false,
        },
        user: {
          property: false,
          autoFetch: true,
        },
        rewriteRedirects: true,
        fullPathRedirect: true,
      },
    },
    redirect: {
      logout: "/login",
      login: false,
      callback: false,
      home: false,
    },
  },

  styleResources: {
    scss: [
      "assets/styles/_variables.scss",
      "assets/styles/_main.scss",
      "bootstrap/scss/_functions.scss",
      "bootstrap/scss/_variables.scss",
      "bootstrap/scss/_mixins.scss",
    ],
  },

  // Bootstrap settings
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
  },

  // Toast config
  toast: {
    position: "top-right",
    timeout: 2032,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.5,
    showCloseButtonOnHover: true,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.SERVER_HOST || "http://localhost:9000/api/",
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // SSR
  ssr: false,
  loading: {
    color: "#88b09f",
    height: "5px",
  },

  // Ignore files
  ignore: [
    "pages/bestellubersicht/sections/*.vue",
    "pages/home/sections/*.vue",
  ],
};
