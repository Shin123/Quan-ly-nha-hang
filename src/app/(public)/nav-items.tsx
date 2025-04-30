'use client'

import { useAppContext } from '@/components/app-provider'
import { Role } from '@/constants/type'
import Link from 'next/link'
import { RoleType } from '../types/jwt.types'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { useGuestLogoutMutation } from '@/queries/useGuest'

const menuItems: {
  title: string
  href: string
  role?: RoleType[]
  hiddenWhenLogin?: boolean
}[] = [
  {
    title: 'Trang chủ',
    href: '/',
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest],
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
    role: [Role.Guest],
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hiddenWhenLogin: true,
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee],
  },
]

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext()
  const logoutMutation = useLogoutMutation()
  const guestLogoutMutation = useGuestLogoutMutation()
  const router = useRouter()
  const handleLogout = async () => {
    if (logoutMutation.isPending) return
    if (guestLogoutMutation.isPending) return
    try {
      const result =
        role === Role.Guest
          ? await logoutMutation.mutateAsync()
          : await logoutMutation.mutateAsync()
      setRole()
      toast({
        description: result.payload.message,
      })
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error,
      })
    }
  }
  return (
    <>
      {menuItems.map((item) => {
        const isAuth = item.role && role && item.role.includes(role)
        const canShow =
          (item.role === undefined && !item.hiddenWhenLogin) ||
          (!role && item.hiddenWhenLogin)

        if (isAuth || canShow)
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        return null
      })}
      {role && (
        <div className={cn(className, 'cursor-pointer')} onClick={handleLogout}>
          Đăng xuất
        </div>
      )}
    </>
  )
}
