"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconFileDescription,
  IconReport,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AdminSidebar({ variant = "sidebar", ...props }: React.ComponentProps<typeof Sidebar> & { variant?: "sidebar" | "floating" | "inset" }) {
  const router = useRouter()

  const navMain = [
    {
      title: "Dashboard",
      onClick: () => router.push('/admin'),
      icon: IconDashboard,
    },
    {
      title: "Trabajadores",
      onClick: () => router.push('/admin/lista-trabajadores'),
      icon: IconUsers,
    },
    {
      title: "Áreas",
      onClick: () => router.push('/admin/lista-areas'),
      icon: IconBuilding,
    },
    {
      title: "Expedientes",
      onClick: () => router.push('/admin/lista-expedientes'),
      icon: IconFileDescription,
    },
    {
      title: "Reportes",
      onClick: () => router.push('/admin/reportes'),
      icon: IconReport,
    },
  ]

  const socialMedia = [
    {
      title: "Facebook",
      href: "https://facebook.com",
      icon: "/facebook.svg",
      color: "hover:text-blue-600",
    },
    {
      title: "X (Twitter)",
      href: "https://x.com",
      icon: "/x.svg",
      color: "hover:text-black dark:hover:text-white",
    },
    {
      title: "WhatsApp",
      href: "https://wa.me",
      icon: "/whatsapp.svg",
      color: "hover:text-green-600",
    },
  ]

  // Usuario del sistema
  const userData = {
    name: "Usuario Administrador",
    email: "admin@sistema.gob.pe",
    avatar: "/avatars/admin.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/50 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3 hover:bg-muted/50 transition-colors duration-200"
            >
              <div 
                onClick={() => router.push('/admin')}
                className="flex items-center justify-between w-full cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src="/logo_feminis.webp"
                      alt="Logo Clínica"
                      width={36}
                      height={36}
                      className="rounded-lg shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-primary">Administración</span>
                  </div>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="flex-1">
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Navegación Principal
          </h3>
        </div>
        <NavMain items={navMain} />
        
        <div className="flex-1"></div>
        
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Redes Sociales
          </h3>
        </div>
        
        <div className="px-3 space-y-1 mb-4">
          {socialMedia.map((social) => (
            <a
              key={social.title}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 group"
              aria-label={`Visitar ${social.title}`}
            >
              <div className={`p-2 rounded-md bg-muted/30 group-hover:bg-muted/60 transition-colors duration-200 ${social.color}`}>
                <Image
                  src={social.icon}
                  alt={`${social.title} icon`}
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </div>
              <span className="font-medium">{social.title}</span>
            </a>
          ))}
        </div>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border/50">
        <div className="p-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Desarrollado por
          </p>
          <a
            href="https://monstruocreativo.com/software/?v=dd07de856139"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200 hover:scale-105"
            aria-label="Visitar sitio web de Monstruo Creativo"
          >
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Monstruo Creativo
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
