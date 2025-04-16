'use client'

import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import authApiRequest from '@/apiRequests/auth'

const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()
  console.log(pathname)
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return
    let interval: any = null

    const TIMEOUT = 1000
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
      },
    })
    interval = setInterval(checkAndRefreshToken, TIMEOUT)
    return () => {
      clearInterval(interval)
    }
  }, [pathname])
  return null
}
