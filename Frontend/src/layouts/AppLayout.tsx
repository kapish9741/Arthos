import { Outlet, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { LayoutDashboard, Wallet, Briefcase, LogOut, Coins } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AppLayout() {
  const navigate = useNavigate();
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="text-neutral-200 h-5 w-5 shrink-0" />,
    },
    {
      label: "Expenses",
      href: "/expenses",
      icon: <Wallet className="text-neutral-200 h-5 w-5 shrink-0" />,
    },
    {
      label: "Assets",
      href: "/assets",
      icon: <Briefcase className="text-neutral-200 h-5 w-5 shrink-0" />,
    },
    {
      label: "Market",
      href: "/market",
      icon: <Coins className="text-neutral-200 h-5 w-5 shrink-0" />,
    },
  ]
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={cn("flex flex-col md:flex-row bg-neutral-900 w-full flex-1 overflow-hidden", "h-screen")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              <div onClick={handleLogout} className="cursor-pointer">
                <SidebarLink
                  link={{
                    label: "Logout",
                    href: "#",
                    icon: <LogOut className="text-neutral-200 h-5 w-5 shrink-0" />,
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Profile",
                href: "/profile",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-linear-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-semibold">
                    U
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

const Logo = () => {
  return (
    <Link
      to="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white whitespace-pre"
      >
        Arthos
      </motion.span>
    </Link>
  )
}

const LogoIcon = () => {
  return (
    <Link
      to="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
    </Link>
  )
}
