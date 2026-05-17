import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { NextAuthProvider } from "@/components/providers/auth-provider"
import { ToastProvider } from "@/components/providers/toast-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Vivit CRM - Enterprise SaaS Platform",
  description: "Vivit CRM by VIVIT GROUP - Complete client management, media buying, creative workflow, and sales pipeline solution",
  keywords: ["CRM", "SaaS", "Marketing", "Media Buying", "Creative", "Sales", "VIVIT GROUP"],
  authors: [{ name: "VIVIT GROUP" }],
  openGraph: {
    title: "Vivit CRM",
    description: "Enterprise CRM Platform by VIVIT GROUP",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <ToastProvider />
            {children}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
