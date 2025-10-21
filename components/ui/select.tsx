"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps {
  children?: React.ReactNode
  name?: string
  required?: boolean
  value?: string
  onValueChange?: (value: string) => void
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

interface SelectValueProps {
  placeholder?: string
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children?: React.ReactNode
}

function Select({ children, value, onValueChange }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value || "")
  
  React.useEffect(() => {
    setSelectedValue(value || "")
  }, [value])
  
  const handleSelect = (newValue: string) => {
    setSelectedValue(newValue)
    setIsOpen(false)
    onValueChange?.(newValue)
  }
  
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen,
            setIsOpen,
            selectedValue,
            handleSelect
          } as Record<string, unknown>)
        }
        return child
      })}
    </div>
  )
}

function SelectTrigger({ children, className, isOpen, setIsOpen }: SelectTriggerProps & { isOpen?: boolean; setIsOpen?: (open: boolean) => void }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen?.(!isOpen)}
    >
      {children}
    </button>
  )
}

function SelectValue({ placeholder }: SelectValueProps) {
  return <span className="text-muted-foreground">{placeholder}</span>
}

function SelectContent({ children, className, isOpen, handleSelect }: SelectContentProps & { isOpen?: boolean; handleSelect?: (value: string) => void }) {
  if (!isOpen) return null
  
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md top-full left-0 right-0 mt-1",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            handleSelect
          } as Record<string, unknown>)
        }
        return child
      })}
    </div>
  )
}

function SelectItem({ value, children, className, handleSelect }: SelectItemProps & { handleSelect?: (value: string) => void }) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={() => handleSelect?.(value)}
    >
      {children}
    </button>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}