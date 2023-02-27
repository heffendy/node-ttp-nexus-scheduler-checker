declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/consistent-type-imports
  var fetch: typeof import('undici').fetch
}
