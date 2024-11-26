"use client"

import React from 'react'
import copy from "copy-to-clipboard"
import { useOrbiterToast } from '@orbiter-finance/widget'

export function useCopyGroup() {

    const { orbiterTotas } = useOrbiterToast()

    const handleCopy = React.useCallback(
        (str: string) => {
            if (copy(str)) {
                orbiterTotas.sucess({ title: "Copied" })
            }
        },
        [orbiterTotas],
    )

    return ({
        handleCopy
    })
}
