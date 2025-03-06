
import * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import { cn } from "@/lib/utils"

interface DisclosureProps extends React.ComponentPropsWithoutRef<typeof Collapsible> {
  children: React.ReactNode
}

const Disclosure = ({ children, className, ...props }: DisclosureProps) => {
  return (
    <Collapsible className={cn("w-full", className)} {...props}>
      {children}
    </Collapsible>
  )
}

const DisclosureTrigger = CollapsibleTrigger
const DisclosureContent = CollapsibleContent

export { Disclosure, DisclosureTrigger, DisclosureContent }
