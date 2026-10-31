import { Schema } from 'effect'

type _Bucket = _Base & { readonly doc_count: number }

type _Base = { readonly meta?: string }

const Base: Schema.Schema<_Base> = Schema.Struct({ meta: Schema.optional(Schema.String) })

export const Bucket: Schema.Schema<_Bucket> = Schema.Unknown.check(
  Schema.makeFilter(
    (input) =>
      typeof input !== 'object' ||
      input === null ||
      Array.isArray(input) ||
      Object.entries(input).every(
        ([k, v]) => ['meta', 'doc_count'].includes(k) || Schema.is(Schema.suspend(() => Base))(v),
      ),
  ),
).pipe(
  Schema.decodeTo(
    (() => {
      const M0 = Schema.suspend(() => Base)
      const M1 = Schema.Struct({ doc_count: Schema.Number.check(Schema.isInt()) })
      return Schema.Unknown.pipe(
        Schema.refine(
          (input): input is typeof M0.Type & typeof M1.Type =>
            Schema.is(Schema.toEncoded(M0))(input) && Schema.is(Schema.toEncoded(M1))(input),
        ),
      )
    })(),
  ),
)

export type Bucket = typeof Bucket.Type
