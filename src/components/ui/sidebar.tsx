"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

/* -------------------------------------------------------------------------- */
/*                                   CONSTS                                   */
/* -------------------------------------------------------------------------- */

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

type SidebarContextType = {
  open: boolean
  toggle: () => void
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}

/* -------------------------------------------------------------------------- */
/*                               PROVIDER                                     */
/* -------------------------------------------------------------------------- */

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(true)

  const toggle = () => setOpen((o) => !o)

  return (
    <SidebarContext.Provider value={{ open, toggle, isMobile }}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  SIDEBAR                                   */
/* -------------------------------------------------------------------------- */

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { open, isMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={open}>
        <SheetContent side="left" className="p-0 w-[--sidebar-width]">
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      className={cn(
        "h-screen border-r bg-sidebar transition-all",
        open ? "w-[--sidebar-width]" : "w-[--sidebar-width-icon]"
      )}
      style={
        {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        } as React.CSSProperties
      }
    >
      {children}
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/*                             MENU BUTTON                                    */
/* -------------------------------------------------------------------------- */

const sidebarMenuButtonVariants = cva(
  "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent",
  {
    variants: {
      active: {
        true: "bg-accent font-medium",
        false: "text-muted-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

type SidebarMenuButtonProps =
  React.ComponentPropsWithoutRef<"button"> &
    VariantProps<typeof sidebarMenuButtonVariants> & {
      asChild?: boolean
      tooltip?: string
    }

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(function SidebarMenuButton(
  { asChild, tooltip, active, className, ...props },
  ref
) {
  const Comp = asChild ? Slot : "button"

  const button = (
    <Comp
      ref={ref}
      className={cn(
        sidebarMenuButtonVariants({ active }),
        className
      )}
      {...props}
    />
  )

  if (!tooltip) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  )
})

SidebarMenuButton.displayName = "SidebarMenuButton"

/* -------------------------------------------------------------------------- */
/*                             TOGGLE BUTTON                                  */
/* -------------------------------------------------------------------------- */

export function SidebarToggle() {
  const { toggle } = useSidebar()

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
}
