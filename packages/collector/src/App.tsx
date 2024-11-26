import React from "react"
import { BridgePage } from "./page/BridgePage"
import { Providers } from "./providers/Providers"
export const App = React.forwardRef(({ config }: { config: any }, ref) => {
  return (
    <Providers config={config}>
      <BridgePage isMainnet={config?.isMainnet} />
    </Providers>
  )
})
