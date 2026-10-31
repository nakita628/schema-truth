import { Schema } from 'effect'

type _Connections = readonly _Connection[]

type _ConnectionBase = { readonly name?: string; readonly type?: 'Sample' | 'Kafka' }

type _KafkaConnection = _ConnectionBase & { readonly bootstrapServers?: string }

type _SampleConnection = _ConnectionBase

type _Connection = _SampleConnection | _KafkaConnection

const ConnectionBase: Schema.Schema<_ConnectionBase> = Schema.Struct({
  name: Schema.optional(Schema.String),
  type: Schema.optional(Schema.Literals(['Sample', 'Kafka'])),
})

const KafkaConnection: Schema.Schema<_KafkaConnection> = (() => {
  const M0 = Schema.suspend(() => ConnectionBase)
  const M1 = Schema.Struct({ bootstrapServers: Schema.optional(Schema.String) })
  return Schema.Unknown.pipe(
    Schema.refine(
      (input): input is typeof M0.Type & typeof M1.Type =>
        Schema.is(Schema.toEncoded(M0))(input) && Schema.is(Schema.toEncoded(M1))(input),
    ),
  )
})()

const SampleConnection: Schema.Schema<_SampleConnection> = Schema.suspend(() => ConnectionBase)

const Connection: Schema.Schema<_Connection> = Schema.Union([
  Schema.suspend(() => SampleConnection),
  Schema.suspend(() => KafkaConnection),
])

export const Connections: Schema.Schema<_Connections> = Schema.Array(
  Schema.suspend(() => Connection),
)

export type Connections = typeof Connections.Type
