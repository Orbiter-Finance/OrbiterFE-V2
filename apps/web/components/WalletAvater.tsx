import React, { useEffect, useRef, HTMLAttributes } from 'react'
import block from "ethereum-blockies"
import { OrbiterShow } from '@orbiter-finance/ui'
import { cn } from '../utils/cn'

const WalletAvater: React.FC<{ walletAddress?: string } & HTMLAttributes<HTMLDivElement>> = ({
    walletAddress,
    className,
    ...rest
}) => {
    const canvasRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (canvasRef.current && walletAddress) {
            canvasRef.current.innerHTML = ''
            const icon = block.create({ // All options are optional
                seed: walletAddress.toLocaleLowerCase(), // seed used to generate icon data, default: random
                color: '#FF5C5C', // to manually specify the icon color, default: random
                // bgcolor: '#aaa', // choose a different background color, default: random
                scale: 3, // width/height of each block in pixels, default: 4
                size: 20,
                spotcolor: '#1A1A1A', // each pixel has a 13% chance of being of a third color, 
                // default: random. Set to -1 to disable it. These "spots" create structures
                // that look like eyes, mouths and noses. 
                default: -1
            })
            canvasRef.current.appendChild(icon)
        }
    }, [walletAddress, canvasRef])

    return (
        <OrbiterShow
            when={!!walletAddress}
        >
            <div ref={canvasRef} {...rest} className={
                cn('flex justify-center items-center w-6 h-6 rounded-full overflow-hidden', className)
            }></div>
        </OrbiterShow>
    )
}


export default WalletAvater