# AniChart

A modern anime discovery and exploration web application built with Nuxt 4. Browse, search, and discover anime with detailed information sourced from the AniList GraphQL API.

## Features

- **Advanced Search**: Case-insensitive search with fuzzy matching and auto-complete
- **Smart Filtering**: Filter by season, year, popularity, ratings, and more
- **Responsive Design**: Optimized for desktop and mobile devices
- **Infinite Scroll**: Seamless browsing experience with automatic content loading
- **Detailed Information**: Complete anime metadata including descriptions, ratings, and studio information
- **Modern UI**: Clean, accessible interface with smooth animations and transitions
- **Performance Optimized**: Server-side rendering, image optimization, and efficient caching

## Tech Stack

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **Styling**: SCSS with CSS custom properties for theming
- **Data Source**: AniList GraphQL API
- **Icons**: Nuxt Icon with Lucide icon set
- **Image Optimization**: Nuxt Image with WebP/AVIF support
- **Testing**: Vitest with Vue Test Utils
- **Code Quality**: ESLint and Prettier
- **TypeScript**: Full type safety throughout the application

## Setup

Install dependencies:

```bash
bun install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
bun run dev
```

## Testing

Run the test suite:

```bash
bun run test
```

Run tests in watch mode:

```bash
bun run test:watch
```

## Code Quality

Lint the codebase:

```bash
bun run lint
```

Fix linting issues automatically:

```bash
bun run lint:fix
```

Format code with Prettier:

```bash
bun run format
```

## Production

Build the application for production:

```bash
bun run build
```

Preview the production build locally:

```bash
bun run preview
```

Generate static files:

```bash
bun run generate
```

## Project Structure

```
app/
├── assets/          # Styles and static assets
├── components/      # Vue components
│   └── __tests__/   # Component tests
├── composables/     # Vue composables for state management
├── pages/           # File-based routing pages
├── server/          # Server-side API routes
└── utils/           # Utility functions and types
    ├── api/         # API layer and GraphQL queries
    ├── helpers/     # Helper functions
    └── types/       # TypeScript type definitions
```

## Key Components

- **SearchFilters**: Advanced search and filtering interface
- **AnimeGrid**: Responsive grid layout for anime cards
- **AnimeCard**: Individual anime item display
- **AnimeBanner**: Hero section for anime details
- **AnimeMetadata**: Detailed anime information display

## API Integration

The application integrates with the AniList GraphQL API to provide:

- Comprehensive anime database
- Real-time search functionality
- Detailed metadata and relationships
- High-quality cover art and banners
- Community ratings and popularity metrics

## Performance Features

- **SSR**: Server-side rendering for better SEO and initial load times
- **Image Optimization**: Automatic WebP/AVIF conversion and responsive images
- **Caching**: Intelligent caching strategy for API responses
- **Tree Shaking**: Only necessary code and icons are included in the bundle
- **Lazy Loading**: Components and images load on demand

## License

This project is for educational and personal use. Anime data is provided by AniList.
