import { defineConfig } from 'orval'

export default defineConfig({
  auctions: {
    input: {
      target: './openapi.auctions.v0.json',
    },
    output: {
      mode: 'tags-split',
      target: 'src/shared/api/generated',
      schemas: 'src/shared/api/generated/schemas',
      client: 'react-query',
      httpClient: 'fetch',
      mock: false,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
})
