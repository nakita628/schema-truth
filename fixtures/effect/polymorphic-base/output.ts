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

const KafkaConnection: Schema.Schema<_KafkaConnection> = Schema.suspend(() => ConnectionBase).check(
  Schema.makeFilter((input) =>
    Schema.is(Schema.Struct({ bootstrapServers: Schema.optional(Schema.String) }))(input),
  ),
)

const SampleConnection: Schema.Schema<_SampleConnection> = Schema.suspend(() => ConnectionBase)

const Connection: Schema.Schema<_Connection> = Schema.Union([
  Schema.suspend(() => SampleConnection),
  Schema.suspend(() => KafkaConnection),
])

export const Connections: Schema.Schema<_Connections> = Schema.Array(
  Schema.suspend(() => Connection),
)

export type Connections = typeof Connections.Type
