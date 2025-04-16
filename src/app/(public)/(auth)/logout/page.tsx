'use client'

import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Logout() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const ref = useRef<any>(null)
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const accessTokenFromUrl = searchParams.get('accessToken')
  useEffect(() => {
    if (
      ref.current ||
      (refreshTokenFromUrl &&
        refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl !== getAccessTokenFromLocalStorage())
    )
      return
    ref.current = mutateAsync
    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null
      }, 1000)
      router.push('/login')
    })
  }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl])
  return <div>Logout ...</div>
}
