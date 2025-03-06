
import * as React from "react"
import * as DisclosurePrimitive from "@radix-ui/react-accordion"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

// We're using Radix UI Accordion as a base for our Disclosure component
// since they have similar functionality
const Disclosure = DisclosurePrimitive.Root

const DisclosureTrigger = React.forwardRef<
  React.ElementRef<typeof DisclosurePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DisclosurePrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <DisclosurePrimitive.Header className="flex">
    <DisclosurePrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </DisclosurePrimitive.Trigger>
  </DisclosurePrimitive.Header>
))
DisclosureTrigger.displayName = "DisclosureTrigger"

const DisclosureContent = React.forwardRef<
  React.ElementRef<typeof DisclosurePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DisclosurePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DisclosurePrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </DisclosurePrimitive.Content>
))
DisclosureContent.displayName = "DisclosureContent"

export { Disclosure, DisclosureTrigger, DisclosureContent }
