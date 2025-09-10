// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Enable SSR
  ssr: true,

  // CSS configuration
  css: ['~/assets/styles/anime.scss'],

  // Vite configuration
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:math";'
        }
      }
    }
  },

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      anilistApiUrl: process.env.ANILIST_API_URL || 'https://graphql.anilist.co'
    }
  },

  // Nitro configuration
  nitro: {
    // Server-side configuration will be handled in server/api routes
  },

  // App configuration
  app: {
    head: {
      title: 'AniChart',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Discover and explore anime with beautiful charts and detailed information.'
        }
      ]
    }
  },

  // Modules
  modules: ['@nuxt/eslint', '@nuxt/image'],

  // Image configuration
  image: {
    // Enable image optimization
    format: ['webp', 'avif', 'png', 'jpg'],
    // Configure domains for external images (useful for anime images)
    domains: ['anilist.co', 's4.anilist.co', 'cdn.myanimelist.net'],
    // Cache images for better performance
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 150,
          height: 150,
          fit: 'cover'
        }
      },
      cover: {
        modifiers: {
          format: 'webp',
          width: 600,
          height: 900,
          fit: 'cover'
        }
      },
      banner: {
        modifiers: {
          format: 'webp',
          width: 1200,
          height: 400,
          fit: 'cover'
        }
      }
    }
  },

  // TypeScript configuration
  typescript: {
    typeCheck: false
  }
})
