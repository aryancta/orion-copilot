import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "Orion Copilot - AI Workflow Assistant",
  description: "Turn messy documents into clear actions in seconds. AI-powered workflow assistant for operations, support, and administration.",
  keywords: ["AI", "workflow", "document analysis", "automation", "productivity"],
  authors: [{ name: "Aryan Choudhary" }],
  openGraph: {
    title: "Orion Copilot - AI Workflow Assistant",
    description: "Turn messy documents into clear actions in seconds",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orion Copilot - AI Workflow Assistant",
    description: "Turn messy documents into clear actions in seconds",
  },
  robots: "index, follow",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              {children}
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}