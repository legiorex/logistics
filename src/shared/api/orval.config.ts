import { defineConfig } from 'orval'

export default defineConfig({
  auctions: {
    input: {
      target: './openapi.auctions.v0.json',
    },
    output: {
      mode: 'tags',
      target: './generated',
      schemas: './generated/schemas',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        header: true,
        mutator: {
          name: 'customInstance',
          path: './custom-instance.ts',
        },
      },
      mock: {
        generators: [
          {
            type: 'msw',
            baseUrl: '/api',
          },
        ],
      },
      formatter: 'prettier',
      clean: true,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
})
