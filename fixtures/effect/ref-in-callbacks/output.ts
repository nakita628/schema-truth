import { Schema } from 'effect'

type _Doc = {
  readonly a?: string
  readonly list?: readonly { [key: string]: unknown }[]
  readonly kind?: string
}

type _Base = { readonly meta: string }

type _NeedsKind = { readonly kind: string }

const Base: Schema.Schema<_Base> = Schema.Struct({ meta: Schema.String })

const NeedsKind: Schema.Schema<_NeedsKind> = Schema.Struct({ kind: Schema.String })

export const Doc: Schema.Schema<_Doc> = Schema.Unknown.check(
  Schema.makeFilter(
    (input) =>
      Schema.is(
        Schema.Struct({
          a: Schema.optional(Schema.String),
          list: Schema.optional(
            Schema.Array(Schema.Struct({})).check(
              Schema.makeFilter(
                (input) =>
                  input.filter((item) => Schema.is(Schema.suspend(() => Base))(item)).length >= 1,
              ),
            ),
          ),
          kind: Schema.optional(Schema.String),
        }),
      )(input),
    { message: 'bad doc' },
  ),
)
  .pipe(
    Schema.decodeTo(
      Schema.Struct({
        a: Schema.optional(Schema.String),
        list: Schema.optional(
          Schema.Array(Schema.Struct({})).check(
            Schema.makeFilter(
              (input) =>
                input.filter((item) => Schema.is(Schema.suspend(() => Base))(item)).length >= 1,
            ),
          ),
        ),
        kind: Schema.optional(Schema.String),
      }),
    ),
  )
  .check(
    Schema.makeFilter((input) =>
      Object.entries(input).every(
        ([key, value]) =>
          !new RegExp('^p-').test(key) || Schema.is(Schema.suspend(() => Base))(value),
      ),
    ),
    Schema.makeFilter(
      (input) => !('a' in input) || Schema.is(Schema.suspend(() => NeedsKind))(input),
    ),
  )

export type Doc = typeof Doc.Type
