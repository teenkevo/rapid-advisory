"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  const closeSheet = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white p-6">
        <nav className="flex flex-col gap-4 pt-8">
          <Link
            href="#"
            className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
            onClick={closeSheet}
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
            onClick={closeSheet}
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
            onClick={closeSheet}
          >
            The Team
          </Link>
          <Link
            href="#"
            className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
            onClick={closeSheet}
          >
            About Us
          </Link>
          <Link
            href="#"
            className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
            onClick={closeSheet}
          >
            Contact Us
          </Link>
          <Link
            href="#"
            className="text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors"
            onClick={closeSheet}
          >
            Customer Resources
          </Link>
          <Button
            size="lg"
            className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-full group bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 mt-4"
            onClick={closeSheet}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0 text-slate-700 group-hover:text-white">
              APPLY NOW
            </span>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
