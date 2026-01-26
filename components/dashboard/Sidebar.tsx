"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { 
  House, 
  ChartBar, 
  Megaphone, 
  Flag, 
  Users, 
  CheckCircle,
  UserCircle,
  Moon,
  Sun,
  type Icon as PhosphorIcon
} from "@phosphor-icons/react"
import { Separator } from "@/components/ui/separator"
import { type UserRole } from "@/lib/auth/permissions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  userRole: UserRole
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

interface NavItem {
  label: string
  href: string
  icon: PhosphorIcon
  requiredRole?: 'super_admin' | 'admin'
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: Flag,
    requiredRole: 'super_admin',
  },
  {
    label: "Admin Management",
    href: "/dashboard/admins",
    icon: Users,
    requiredRole: 'super_admin',
  },
  {
    label: "User Ticks",
    href: "/dashboard/users/ticks",
    icon: CheckCircle,
    requiredRole: 'super_admin',
  },
  {
    label: "Advertisements",
    href: "/dashboard/ads",
    icon: Megaphone,
    requiredRole: 'admin',
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartBar,
    requiredRole: 'admin',
  },
]

export function Sidebar({ userRole, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter((item) => {
    if (!item.requiredRole) {
      return true
    }
    
    return item.requiredRole === userRole
  })

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLinkClick = () => {
    // Close mobile sidebar when a link is clicked
    if (onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-background transition-transform duration-300 lg:static lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo/Header */}
        <div className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          
          {/* Close button for mobile */}
          <button
            onClick={onMobileClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-4">
          {visibleNavItems.map((item) => {
            const Icon = item.icon
            // For /dashboard, only match exact path, not sub-paths
            const isActive = item.href === '/dashboard'
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-5" weight={isActive ? "fill" : "regular"} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Separator />

        {/* Theme Toggle & Profile */}
        <div className="space-y-2 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-start gap-3 px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {theme === "dark" ? (
              <>
                <Sun className="size-5" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="size-5" />
                Dark Mode
              </>
            )}
          </Button>
          
          <Link
            href="/dashboard/profile"
            onClick={handleLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/dashboard/profile"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <UserCircle className="size-5" weight={pathname === "/dashboard/profile" ? "fill" : "regular"} />
            Profile
          </Link>
        </div>
      </div>
    </>
  )
}
