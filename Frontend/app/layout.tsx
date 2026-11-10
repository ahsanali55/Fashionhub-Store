import type { Metadata } from 'next'
import { Manrope } from "next/font/google";
import { ClientLayout } from './client-layout'
import './globals.css'
import AuthProvider, { ReduxProvider } from './redux-provider'

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});
export const metadata: Metadata = {
  title: 'FashionHub - Premium Fashion Store',
  description: 'Discover premium fashion from top suppliers worldwide',
  generator: 'v0.app',
  icons: {
   icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <ReduxProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
