import envConfig from '@/config'
import { LoginResType } from '@/schemaValidations/auth.schema'
import { redirect } from 'next/navigation'
import {
  getAccessTokenFromLocalStorage,
  normalizePath,
  removeTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from './utils'

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }

  constructor({
    status,
    payload,
    message = 'HttpError',
  }: {
    status: number
    payload: any
    message?: string
  }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS
  payload: EntityErrorPayload
  constructor({
    status,
    payload,
  }: {
    status: typeof ENTITY_ERROR_STATUS
    payload: EntityErrorPayload
  }) {
    super({ status, payload, message: 'EntityError' })
    this.status = status
    this.payload = payload
  }
}

let clientLogoutRequest: null | Promise<any> = null
const isClient = typeof window !== 'undefined'
const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined
  if (options?.body instanceof FormData) {
    body = options.body
  } else if (options?.body) {
    body = JSON.stringify(options.body)
  }

  const baseHeaders: {
    [key: string]: string
  } = body instanceof FormData ? {} : { 'Content-Type': 'application/json' }

  if (isClient) {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_URL
      : options.baseUrl

  const fullUrl = `${baseUrl}/${normalizePath(url)}`
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  })

  const payload: Response = await res.json()
  const data = {
    status: res.status,
    payload,
  }

  // Interceptor xử lý request và response trước khi trả về cho phía component
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422
          payload: any
        }
      )
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch('/api/auth/logout', {
            method: 'POST',
            body: null, // Logout luôn luôn thành công
            headers: {
              ...baseHeaders,
            } as any,
          })
          try {
            await clientLogoutRequest
          } catch {
          } finally {
            removeTokenFromLocalStorage()
            clientLogoutRequest = null
            // Redirect về trang login có thể loop vô hạn nếu không xử lý đúng.
            location.href = '/login'
          }
        }
      } else {
        const accessToken = (options?.headers as any)?.Authorization?.split(
          'Bearer '
        )[1]
        redirect(`/logout?accessToken=${accessToken}`)
      }
    } else {
      throw new HttpError(data)
    }
  }

  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser)
  if (isClient) {
    const normalizeUrl = normalizePath(url)
    if (['api/auth/login', 'api/guest/auth/login'].includes(normalizeUrl)) {
      const { accessToken, refreshToken } = (payload as LoginResType).data
      setAccessTokenToLocalStorage(accessToken)
      setRefreshTokenToLocalStorage(refreshToken)
    } else if (
      ['api/auth/logout', 'api/guest/auth/logout'].includes(normalizeUrl)
    ) {
      removeTokenFromLocalStorage()
    }
  }
  return data
}

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('GET', url, options)
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<Response>('DELETE', url, { ...options })
  },
}

export default http
