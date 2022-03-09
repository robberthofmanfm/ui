// This file is generated by [oats][0] and should not be edited by hand.
//
// [0]: https://github.com/influxdata/oats

export type FluxdocsArray = Fluxdocs[]

export interface Fluxdocs {
  path: string
  package: string
  name: string
  kind: string
  headline: string
  fluxType: string
  description?: string
  fluxParameters?: FluxdocsParameters[]
}

export interface FluxdocsParameters {
  description?: string
  headline: string
  name: string
  required: boolean
}

export interface Error {
  readonly code:
    | 'internal error'
    | 'not found'
    | 'conflict'
    | 'invalid'
    | 'unprocessable entity'
    | 'empty value'
    | 'unavailable'
    | 'forbidden'
    | 'too many requests'
    | 'unauthorized'
    | 'method not allowed'
    | 'request too large'
    | 'unsupported media type'
  readonly message?: string
  readonly op?: string
  readonly err?: string
}

interface RequestOptions {
  signal?: AbortSignal
}

export type RequestHandler = (
  url: string,
  query: string,
  init: RequestInit
) => {url: string; query: string; init: RequestInit}
export type ResponseHandler = (
  status: number,
  headers: Headers,
  data: any
) => {status: number; headers: Headers; data: any}

const RequestContext = function(
  requestHandler: RequestHandler,
  responseHandler: ResponseHandler
) {
  this.requestHandler = requestHandler
  this.responseHandler = responseHandler
}

RequestContext.prototype.request = async function(
  method: string,
  url: string,
  params: any = {},
  options: RequestOptions = {}
): Promise<any> {
  const requestHeaders = new Headers(params.headers)
  const contentType = requestHeaders.get('Content-Type') || ''

  if (params.auth) {
    const credentials = btoa(`${params.auth.username}:${params.auth.password}`)

    requestHeaders.append('Authorization', `Basic ${credentials}`)
  }

  const body =
    params.data && contentType.includes('json')
      ? JSON.stringify(params.data)
      : params.data

  const query = params.query ? `?${new URLSearchParams(params.query)}` : ''

  const {
    url: middlewareUrl,
    query: middlewareQuery,
    init,
  } = this.requestHandler(url, query, {
    method,
    body,
    credentials: 'same-origin',
    signal: options.signal,
    headers: requestHeaders,
  })

  const response = await fetch(`${middlewareUrl}${middlewareQuery}`, init)

  const {status, headers} = response
  const responseContentType = headers.get('Content-Type') || ''

  let data

  if (responseContentType.includes('json')) {
    data = await response.json()
  } else if (responseContentType.includes('octet-stream')) {
    data = await response.blob()
  } else {
    data = await response.text()
  }

  return this.responseHandler(status, headers, data)
}

RequestContext.prototype.setRequestHandler = function(
  requestHandler: RequestHandler
) {
  this.requestHandler = requestHandler
}

RequestContext.prototype.setResponseHandler = function(
  responseHandler: ResponseHandler
) {
  this.responseHandler = responseHandler
}

const rc = new RequestContext(
  (url, query, init) => {
    return {url, query, init}
  },
  (status, headers, data) => {
    return {status, headers, data}
  }
)
const request = rc.request.bind(rc)
const setRequestHandler = rc.setRequestHandler.bind(rc)
const setResponseHandler = rc.setResponseHandler.bind(rc)

export {request, setRequestHandler, setResponseHandler}

export interface GetFluxdocsParams {}

type GetFluxdocsResult =
  | GetFluxdocsOKResult
  | GetFluxdocsUnauthorizedResult
  | GetFluxdocsInternalServerErrorResult

interface GetFluxdocsOKResult {
  status: 200
  headers: Headers
  data: FluxdocsArray
}

interface GetFluxdocsUnauthorizedResult {
  status: 401
  headers: Headers
  data: Error
}

interface GetFluxdocsInternalServerErrorResult {
  status: 500
  headers: Headers
  data: Error
}

export const getFluxdocs = (
  params: GetFluxdocsParams,
  options: RequestOptions = {}
): Promise<GetFluxdocsResult> =>
  request('GET', '/api/v2private/fluxdocs', params, options) as Promise<
    GetFluxdocsResult
  >

export interface GetFluxdocParams {
  id: string
}

type GetFluxdocResult =
  | GetFluxdocOKResult
  | GetFluxdocBadRequestResult
  | GetFluxdocUnauthorizedResult
  | GetFluxdocInternalServerErrorResult

interface GetFluxdocOKResult {
  status: 200
  headers: Headers
  data: Fluxdocs
}

interface GetFluxdocBadRequestResult {
  status: 400
  headers: Headers
  data: Error
}

interface GetFluxdocUnauthorizedResult {
  status: 401
  headers: Headers
  data: Error
}

interface GetFluxdocInternalServerErrorResult {
  status: 500
  headers: Headers
  data: Error
}

export const getFluxdoc = (
  params: GetFluxdocParams,
  options: RequestOptions = {}
): Promise<GetFluxdocResult> =>
  request(
    'GET',
    `/api/v2private/fluxdocs/${params.id}`,
    params,
    options
  ) as Promise<GetFluxdocResult>

export interface GetFluxdocsSearchParams {
  searchTerm: string

  query?: {
    field?: string
  }
}

type GetFluxdocsSearchResult =
  | GetFluxdocsSearchOKResult
  | GetFluxdocsSearchBadRequestResult
  | GetFluxdocsSearchUnauthorizedResult
  | GetFluxdocsSearchInternalServerErrorResult

interface GetFluxdocsSearchOKResult {
  status: 200
  headers: Headers
  data: FluxdocsArray
}

interface GetFluxdocsSearchBadRequestResult {
  status: 400
  headers: Headers
  data: Error
}

interface GetFluxdocsSearchUnauthorizedResult {
  status: 401
  headers: Headers
  data: Error
}

interface GetFluxdocsSearchInternalServerErrorResult {
  status: 500
  headers: Headers
  data: Error
}

export const getFluxdocsSearch = (
  params: GetFluxdocsSearchParams,
  options: RequestOptions = {}
): Promise<GetFluxdocsSearchResult> =>
  request(
    'GET',
    `/api/v2private/fluxdocs/search/${params.searchTerm}`,
    params,
    options
  ) as Promise<GetFluxdocsSearchResult>