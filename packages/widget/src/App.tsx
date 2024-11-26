
import React from 'react'
import { Page } from './page/Page.js'
import { ConfigType, Provider } from './Provider/Provider.js'
import { BridgePage } from './page/BridgePage.js'

export const App = React.forwardRef(
    ({ config }: { config: ConfigType }, ref) => {
        return (
            <Provider config={config}>
                <BridgePage />
            </Provider>
        )
    },
)