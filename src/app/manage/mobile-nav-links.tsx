'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Package2, PanelLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import menuItems from './menuItems'
import { cn } from '@/lib/utils'

export default function MobileNavLinks() {
  const pathname = usePathname()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href={'#'}
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full
            bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Beef Restaurant</span>
          </Link>

          {menuItems.map((Item, index) => {
            const isActive = pathname === Item.href
            return (
              <Link
                href={Item.href}
                key={index}
                className={cn(
                  'flex items-center gap-4 px-2.5 hover:text-foreground',
                  {
                    'text-foreground': isActive,
                    'text-muted-foreground': !isActive,
                  }
                )}
              >
                <Item.Icon className="h-5 w-5" />
                {Item.title}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
