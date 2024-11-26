import type { Metadata, Viewport } from 'next'
import './animation.css'
import './globals.css'
import '@orbiter-finance/ui/dist/index.css'
import '@orbiter-finance/widget/dist/index.css'

import { GoogleTagManager } from '@next/third-parties/google'
import { GOOGLE_ANALYTICS_ID } from './constant'
import Providers from './Providers'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
export const metadata: Metadata = {
    title: 'Orbiter Finance｜Instantly Bridge Your Ethereum from Ethereum to Optimism, Cross Multiple Chains with Ease',
    description:
        'Empower Your Crypto Journey: Seamlessly Transfer Assets Between Multiple Chains in Seconds. Experience Swift, Secure, and Effortless Cross-Chain Transactions with Orbiter Finance Innovative Solution',
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                    <GoogleTagManager gtmId={GOOGLE_ANALYTICS_ID} />
                    <Toaster />
                </Providers>
            </body>
        </html>
    )
}
