import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hồ Đức Đoan | Creative Video Editor & Visual Storyteller',
  description:
    'Portfolio chính thức của Hồ Đức Đoan — Video Editor chuyên nghiệp với phong cách dựng phim điện ảnh, quảng cáo thương mại và nội dung sáng tạo đa nền tảng.',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} scroll-smooth`}
    >
      <head suppressHydrationWarning />
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:bg-indigo-400/30 dark:selection:text-indigo-200 transition-colors duration-300"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="portfolio-theme-light"
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
