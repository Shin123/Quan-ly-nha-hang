import { DarkModeToggle } from '@/components/dark-mode-toggle'
import NavLinks from './nav-links'
import MobileNavLinks from './mobile-nav-links'
import DropdownAvatar from './dropdown-avatar'

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <NavLinks />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header
          className="sticky top-0 border-b z-30 flex items-center gap-4 bg-background px-4 h-14 
        sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
        >
          <MobileNavLinks />
          <div className="relative ml-auto flex-1 md:grow-0">
            <div className="flex justify-end">
              <DarkModeToggle />
            </div>
          </div>
          <DropdownAvatar />
        </header>
        {children}
      </div>
    </div>
  )
}
