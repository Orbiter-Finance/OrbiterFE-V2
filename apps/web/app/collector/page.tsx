'use client'

import dynamic from 'next/dynamic'
import React from 'react'
import Footer from '../../components/Footer'

const CollectorPage = dynamic(() => import('./CollectorPage'), { ssr: false })

export default function Page() {
    return (
        <main className="w-full h-full flex justify-between items-start flex-col orbiter-main">
            <div className="w-full px-3 pb-20">
                <CollectorPage />
            </div>
            <Footer />
        </main>
    )
}
