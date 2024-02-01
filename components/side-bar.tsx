'use client'

import Link from "next/link"

import { siteConfig } from "@/config/site"

import { Icons } from "./icons"
import { MainNav } from "./main-nav"
import { Toaster } from "./ui/toaster"

const SideBar = () => {
  return (
    <aside className="w-60 shrink-0 space-y-6 border-r px-4 py-6">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="size-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      <MainNav items={siteConfig.mainNav} />
      <Toaster />
    </aside>
  )
}

export default SideBar
