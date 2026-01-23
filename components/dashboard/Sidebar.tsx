"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  House, 
  ChartBar, 
  Megaphone, 
  Flag, 
  Users, 
  CheckCircle,
  SignOut,
  type Icon as PhosphorIcon
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { removeToken } from "@/lib/auth/token"
import { 
  canAccessAdminManagement, 
  canAccessUserTicks,
  type UserRole 
} from "@/lib/auth/permissions"
import { cn } from "@/lib/utils"

interface SidebarProps {
  userRole: UserRole
}

interface NavItem {
  label: string
  href: string
  icon: PhosphorIcon
  requiredRole?: 'super_admin'
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
  },
  {
    label: "Advertisements",
    href: "/dashboard/ads",
    icon: Megaphone,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: ChartBar,
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
]

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    removeToken()
    router.push("/login")
  }

  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter((item) => {
    if (!item.requiredRole) {
      return true
    }
    
    if (item.requiredRole === 'super_admin') {
      return canAccessAdminManagement(userRole) || canAccessUserTicks(userRole)
    }
    
    return true
  })

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
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

      {/* Logout Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <SignOut className="size-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
