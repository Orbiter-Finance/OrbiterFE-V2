import React from "react"

export function shortenAddress(address: string, len = 6) {
    const str = address ? String(address) : ""

    if (str?.length <= 11)
        return str
    return `${str?.substring(0, len)}...${str?.substring(str?.length - len, str?.length)}`
}