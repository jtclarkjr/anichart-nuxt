// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Enable SSR
  ssr: true,

  // CSS configuration
  css: ['@/assets/css/tailwind.css'],

  // Vite configuration
  vite: {
    // Type assertion needed due to Vite plugin version incompatibility between Nuxt 4 and @tailwindcss/vite
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss()] as any,
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
    routeRules: {
      '/': { redirect: '/anime' }
    }
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
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/icon', 'shadcn-nuxt'], // Disabled '@nuxtjs/storybook' due to version compatibility issues

  // Component configuration
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false
      },
      {
        path: '~/components/ui',
        pathPrefix: false,
        extensions: ['.vue']
      }
    ]
  },

  // shadcn-nuxt configuration
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

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
          width: 150,
          height: 150
        }
      },
      cover: {
        modifiers: {
          width: 600,
          height: 900
        }
      },
      banner: {
        modifiers: {
          width: 1200,
          height: 400
        }
      }
    }
  },

  // TypeScript configuration
  typescript: {
    typeCheck: 'build'
  }
})
