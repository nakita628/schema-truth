import type { PARAM_LOCATIONS, PARAM_STYLES } from '../../constants/index.js'

/**
 * OpenAPI parameter location, or `formData` for a field of a form body
 * (`application/x-www-form-urlencoded`, `multipart/form-data`).
 *
 * Every location is string-wire — when a primitive schema is emitted under one of
 * them, generators read a number from the JSON number grammar and an integer from
 * digits with no leading zero before converting the text, read a literal, an `enum`
 * and the text `null` from the text, wrap a value sent once into an array of one,
 * and copy an object with an `Object.prototype`-named property onto a null-prototype
 * object before the check. Boolean text is the same set for every target.
 *
 * @see https://spec.openapis.org/oas/v3.2.0.html#parameter-object
 */
export type ParamIn = (typeof PARAM_LOCATIONS)[number]

/**
 * The `style` of an OpenAPI Parameter Object: how its text is serialised. Defaults to
 * `form` for `query` / `cookie` / `formData` and `simple` for `path` / `header`.
 *
 * @see https://spec.openapis.org/oas/v3.2.0.html#style-values
 */
export type ParamStyle = (typeof PARAM_STYLES)[number]
