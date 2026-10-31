import { Type, type Static } from 'typebox'

const Mode = Type.Union([
  Type.Literal('coerce'),
  Type.Literal('ignore_malformed'),
  Type.Literal('strict'),
])

const Precision = Type.Number()

export const Settings = Type.Object({
  precision: Type.Optional(Precision),
  mode: Type.Optional(Mode),
  fallbackMode: Type.Optional(Mode),
  ratio: Type.Optional(Type.Number({ default: 0.5 })),
  count: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
  attachments: Type.Optional(
    Type.Union([Type.Literal('cover'), Type.Boolean()], { default: false }),
  ),
})

export type Settings = Static<typeof Settings>
