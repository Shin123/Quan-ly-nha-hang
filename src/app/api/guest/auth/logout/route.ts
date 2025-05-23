import guestApiRequest from '@/apiRequests/guest'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value
  // delete all when token is expired and logout successfully
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: 'Không nhận được access token hoặc refresh token',
      },
      { status: 200 }
    )
  }
  try {
    const result = await guestApiRequest.sLogout({
      accessToken,
      refreshToken,
    })
    return Response.json(result.payload)
  } catch (error) {
    return Response.json(
      {
        message: 'Lỗi khi gọi Api server',
      },
      { status: 200 }
    )
  }
}
