import { type RequestInit } from 'undici'

// Workaround for fetch not exposed to typescript:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60924#issuecomment-1246622957
// TODO: Why doesn't putting this in global.d.ts work?!
declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/consistent-type-imports
  var fetch: typeof import('undici').fetch
}

// https://www.newline.co/@bespoyasov/how-to-use-fetch-with-typescript--a81ac257
export const request = async <TResponse>(url: string, config: RequestInit = {}): Promise<TResponse> => {
  const response = await fetch(url, config)
  return response.json() as TResponse
}
