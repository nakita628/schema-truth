import { scope } from 'arktype'

const types = scope({
  Base: { 'meta?': 'string' },
  Bucket: ['Base', '&', { doc_count: 'number.integer' }],
}).export()

export const Bucket = types.Bucket

export type Bucket = typeof Bucket.infer
