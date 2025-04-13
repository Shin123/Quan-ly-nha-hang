'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const account = {
  name: 'Nguyễn Văn Tây',
  avatar: 'https://github.com/shadcn.png',
}

export default function DropdownAvatar() {
  const logoutMutation = useLogoutMutation()
  const router = useRouter()
  const handleLogout = async () => {
    if (logoutMutation.isPending) return
    try {
      const result = await logoutMutation.mutateAsync()
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage src={account.avatar ?? undefined} alt={account.name} />
            <AvatarFallback>
              {account.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{account.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/manage/setting'} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
