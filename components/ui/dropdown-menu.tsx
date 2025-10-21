"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children?: React.ReactNode
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children?: React.ReactNode
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  children?: React.ReactNode
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

interface DropdownMenuCheckboxItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  children?: React.ReactNode
}

function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative inline-block text-left">{children}</div>
}

function DropdownMenuTrigger({ asChild, children, className, ...props }: DropdownMenuTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(className, (children.props as any).className),
      ...props
    } as any)
  }
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuContent({ align = "start", children, className, ...props }: DropdownMenuContentProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])
  
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        align === "end" && "right-0",
        align === "center" && "left-1/2 transform -translate-x-1/2",
        !isOpen && "hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({ children, className, ...props }: DropdownMenuItemProps) {
  return (
    <button
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuCheckboxItem({ 
  checked = false, 
  onCheckedChange, 
  children, 
  className, 
  ...props 
}: DropdownMenuCheckboxItemProps) {
  return (
    <button
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span className={cn("mr-2", checked ? "✓" : "○")} />
      {children}
    </button>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
}