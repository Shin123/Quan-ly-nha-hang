import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeToken } from './lib/utils'
import { Role } from './constants/type'

const managePaths = ['/manage']
const guestPaths = ['/guest']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // pathname: /manage/dashboard
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value || ''
  // no auth will can't access to private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  if (refreshToken) {
    // auth will can't access to unAuth paths
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // isAuth &&  access token expired
    if (
      privatePaths.some((path) => pathname.startsWith(path) && !accessToken)
    ) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Permission by role of user
    const role = decodeToken(refreshToken).role
    if (
      (role === Role.Guest &&
        managePaths.some((path) => pathname.startsWith(path))) ||
      (role !== Role.Guest &&
        guestPaths.some((path) => pathname.startsWith(path)))
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/manage/:path*', '/guest/:path*', '/login'],
}
