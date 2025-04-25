import guestApiRequest from '@/apiRequests/guest'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json(
      {
        message: 'Không nhận được refresh token',
      },
      {
        status: 401,
      }
    )
  }
  try {
    const { payload } = await guestApiRequest.sRefreshToken({
      refreshToken,
    })
    const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number
    }
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number
    }
    cookieStore.set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    })
    cookieStore.set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    })

    return Response.json(payload)
  } catch (error: any) {
    return Response.json(
      {
        message: error.message ?? 'Đã có lỗi xảy ra',
      },
      { status: 401 }
    )
  }
}
