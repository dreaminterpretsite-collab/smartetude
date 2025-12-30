"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

type SidebarContextType = {
  open: boolean
  toggle: () => void
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return ctx
}

/* -------------------------------------------------------------------------- */
/*                                PROVIDER                                    */
/* -------------------------------------------------------------------------- */

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(true)

  const toggle = React.useCallback(() => {
    setOpen((o) => !o)
  }, [])

  return (
    <SidebarContext.Provider value={{ open, toggle, isMobile }}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 SIDEBAR                                    */
/* -------------------------------------------------------------------------- */

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { open, isMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={open}>
        <SheetContent side="left" className="p-0 w-64">
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      className={cn(
        "h-screen border-r bg-sidebar transition-all",
        open ? "w-64" : "w-14"
      )}
    >
      {children}
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/*                               TRIGGER                                      */
/* -------------------------------------------------------------------------- */

export function SidebarTrigger() {
  const { toggle } = useSidebar()

  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
}

/* -------------------------------------------------------------------------- */
/*                               STRUCTURE                                    */
/* -------------------------------------------------------------------------- */

export function SidebarContent({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex flex-col flex-1">{children}</div>
}

export function SidebarFooter({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="border-t p-2">{children}</div>
}

export function SidebarSeparator() {
  return <Separator className="my-2" />
}

/* -------------------------------------------------------------------------- */
/*                               MENU                                         */
/* -------------------------------------------------------------------------- */

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-1 p-2">{children}</ul>
}

export function SidebarMenuItem({
  children,
}: {
  children: React.ReactNode
}) {
  return <li>{children}</li>
}

/* -------------------------------------------------------------------------- */
/*                          MENU BUTTON                                       */
/* -------------------------------------------------------------------------- */

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition hover:bg-accent",
  {
    variants: {
      active: {
        true: "bg-accent font-medium",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

type SidebarMenuButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
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
      className={cn(sidebarMenuButtonVariants({ active }), className)}
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
