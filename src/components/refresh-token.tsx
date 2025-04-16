'use client'

import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import authApiRequest from '@/apiRequests/auth'

const UNAUTHENTICATED_PATHS = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathname)) return
    let interval: any = null

    const TIMEOUT = 1000
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
        router.push('/login')
      },
    })
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval)
            router.push('/login')
          },
        }),
      TIMEOUT
    )
    return () => {
      clearInterval(interval)
    }
  }, [pathname, router])
  return null
}
