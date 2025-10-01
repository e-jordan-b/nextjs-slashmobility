import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Technical test Mango",
  description: "Create a <Range/> component",
}

export default function RootLayout({ children }: Readonly <{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}