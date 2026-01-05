import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Translation Manager',
  description: 'Manage your localization keys efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 text-slate-800 min-h-screen p-8 font-sans antialiased">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}

