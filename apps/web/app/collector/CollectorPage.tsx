import React from 'react'
import { HOST_ENV_MAINNET } from '../constant'
import { BridgePage } from '@orbiter-finance/collector'
import '@orbiter-finance/collector/dist/index.css'
export default function CollectorPage() {
    return <BridgePage isMainnet={HOST_ENV_MAINNET} />
}
