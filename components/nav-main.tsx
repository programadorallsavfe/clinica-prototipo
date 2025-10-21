"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export interface NavMainItem {
  title: string
  url?: string
  icon?: React.ComponentType<any>
  isActive?: boolean
  onClick?: () => void
  items?: NavMainItem[]
}

interface NavMainProps extends React.ComponentProps<"nav"> {
  items: NavMainItem[]
}

export function NavMain({ items, className, ...props }: NavMainProps) {
  return (
    <nav
      className={cn("group/nav", className)}
      {...props}
    >
      <ul className="flex flex-col gap-1 group-data-[collapsible=icon]:gap-2">
        {items.map((item) => (
          <NavMainItem key={item.title} item={item} />
        ))}
      </ul>
    </nav>
  )
}

function NavMainItem({ item }: { item: NavMainItem }) {
  const [isOpen, setIsOpen] = React.useState(false)

  if (item.items) {
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="group/collapsible"
      >
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "group w-full justify-start rounded-md px-3 py-2 h-auto font-normal text-left [&[data-state=open]>svg]:rotate-90",
              item.isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            {item.icon && (
              <item.icon className="mr-2 h-4 w-4 shrink-0" />
            )}
            <span className="truncate">{item.title}</span>
            <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="mt-1 space-y-1 px-3">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavMainItem item={subItem} />
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <li>
      <button
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "sm",
          }),
          "group w-full justify-start rounded-md px-3 py-2 h-auto font-normal",
          item.isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
        )}
        onClick={item.onClick}
      >
        {item.icon && (
          <item.icon className="mr-2 h-4 w-4 shrink-0" />
        )}
        <span className="truncate">{item.title}</span>
      </button>
    </li>
  )
}
