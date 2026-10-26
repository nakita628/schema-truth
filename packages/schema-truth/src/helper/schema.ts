import { DEFINITION_REF_PREFIXES } from '../constants/index.js'
import { isDefaultOnlyMember, isSchemaList, isSchemaObject } from '../guard/index.js'
import type { JSONSchema, JSONValue } from '../parser/index.js'
import { coerceDefault } from '../utils/index.js'

/** Named schemas a `default` beside a `$ref` is reconciled against. */
export type SchemaDefinitions = { readonly [name: string]: JSONSchema }

/**
 * The schema a `default` is checked against. A `default` written beside a `$ref`
 * has no `properties` of its own; the named definition's properties (and its
 * additional-properties keywords) stand in, so undeclared keys can be dropped.
 * The node is returned unchanged when the target is not in `definitions`.
 */
export function schemaWithDefaultTarget(
  schema: JSONSchema,
  definitions: SchemaDefinitions | undefined,
): JSONSchema {
  if (schema.properties !== undefined || schema.$ref === undefined || definitions === undefined) {
    return schema
  }
  const name = definitionName(schema.$ref)
  const target = name === undefined ? undefined : definitions[name]
  if (target?.properties === undefined) return schema
  return {
    ...schema,
    properties: target.properties,
    ...(target.additionalProperties !== undefined && {
      additionalProperties: target.additionalProperties,
    }),
    ...(target.patternProperties !== undefined && { patternProperties: target.patternProperties }),
    ...(target.unevaluatedProperties !== undefined && {
      unevaluatedProperties: target.unevaluatedProperties,
    }),
  }
}

function definitionName(ref: string): string | undefined {
  for (const prefix of DEFINITION_REF_PREFIXES) {
    if (!ref.startsWith(prefix)) continue
    const rest = ref.slice(prefix.length)
    if (rest === '' || rest.includes('/')) return undefined
    return decodeURIComponent(rest)
  }
  return undefined
}

/** `definitions` and `$defs` read as one map, `$defs` winning on a shared name. */
export function collectDefinitions(schema: JSONSchema): { readonly [k: string]: JSONSchema } {
  return { ...schema.definitions, ...schema.$defs }
}

/**
 * The schema every array element is validated against: `items` itself, or the first
 * member of a Draft-04 tuple. `undefined` for a boolean `items`, or none.
 */
export function itemsSchemaOf(items: JSONSchema['items']): JSONSchema | undefined {
  if (isSchemaObject(items)) return items
  if (isSchemaList(items)) return items[0]
  return undefined
}

/**
 * The example values of a node: `examples` as given, or the single OpenAPI `example`
 * lifted into a list. `undefined` when the node carries neither.
 */
export function examplesOf(schema: JSONSchema): readonly JSONValue[] | undefined {
  if (schema.examples !== undefined) return schema.examples
  return schema.example === undefined ? undefined : [schema.example]
}

/**
 * Whether a node carries a `default` the generators keep, so a property holding it may be
 * left out of the input.
 */
export function hasKeptDefault(schema: JSONSchema): boolean {
  return schema.default !== undefined && coerceDefault(schema, schema.default).keep
}

/**
 * Whether a node's own emitter already makes it optional with a default: a kept `default`,
 * or an `allOf` member that only carries one. An object wrapping such a property again
 * would hide the default behind the outer wrapper.
 */
export function isOptionalByDefault(schema: JSONSchema): boolean {
  return hasKeptDefault(schema) || schema.allOf?.some(isDefaultOnlyMember) === true
}
