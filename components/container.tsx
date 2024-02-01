import { ReactNode } from "react"

import { cn } from "@/lib/utils"

const Container = (props: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn("container relative grid max-w-6xl items-center gap-6 pb-8 pt-6 md:py-10", props.className)}>
      {props.children}
    </div>
  )
}

export default Container
