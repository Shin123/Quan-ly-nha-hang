'use client'

import { TooltipProvider } from '@radix-ui/react-tooltip'
import { Package2, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import menuItems from './menuItems'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <TooltipProvider>
      <aside className="fixed border-r hidden inset-y-0 left-0 z-10  w-14 flex-col bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href={'#'}
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full
            bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Beef Restaurant</span>
          </Link>

          {menuItems.map((Item, index) => {
            const isActive = pathname === Item.href
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={Item.href}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8',
                      {
                        'bg-accent text-accent-foreground': isActive,
                        'text-muted-foreground': !isActive,
                      }
                    )}
                  >
                    <Item.Icon className="h-5 w-5" />
                    <span className="sr-only">{Item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{Item.title}</TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={'/manage/setting'}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8',
                  {
                    'bg-accent text-accent-foreground':
                      pathname === '/manage/setting',
                    'text-muted-foreground': pathname !== '/manage/setting',
                  }
                )}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Cài đặt</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  )
}
