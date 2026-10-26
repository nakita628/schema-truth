import { Effect, Schema } from 'effect'

export const Filters = Schema.Struct({
  active: Schema.optional(Schema.Boolean),
  fetch_connection_secrets: Schema.optional(Schema.Boolean),
}).pipe(Schema.withDecodingDefault(Effect.succeed({ fetch_connection_secrets: false })))

export type Filters = typeof Filters.Type
