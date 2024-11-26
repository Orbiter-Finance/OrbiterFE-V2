import React, { ReactNode } from 'react'
import { AtomCom, InitialDataType } from '../components/AtomCom.js'
import TransactionAtom from '../components/HooksAtomCom/TransactionAtom.js'
import { Toaster } from "react-hot-toast"

export const ProviderChild = React.memo(({
    children,
    initialData
}: { children: ReactNode, initialData?: InitialDataType }) => {
    return (
        <>
            {children}
            <AtomCom initialData={initialData} />
            <TransactionAtom />
            <Toaster />
        </>
    )
})


