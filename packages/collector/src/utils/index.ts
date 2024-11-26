import BigNumber from 'bignumber.js'
import { formatEther } from 'ethers'

export function shortenAddress(address: string, len = 6) {
    if (!address) return ''
    if (address?.length < 11) return address
    return `${address?.substring(0, len)}...${address?.substring(address?.length - len, address?.length)}`
}

export const limitDecimalPlaces = (
    num: string | number = 0,
    decimal?: string | number,
    delimiter = '',
    currencySymbol = '',
) => {
    if (!num || !parseFloat(num.toString())) return '0'
    decimal ??= 6

    const big = num ? new BigNumber(num).toFixed() : '0'

    const negativeNChar = Number(big) < 0 ? '-' : ''

    const bigArr = (Number(big) < 0 ? big.slice(1) : big)?.toString().split('.')
    let intStr = ''
    let decStr = bigArr[1]?.slice(0, Number(decimal)) || ''

    while (!Number(decStr[decStr.length - 1]) && !!decStr) {
        decStr = decStr.slice(0, decStr.length - 1)
    }
    bigArr[0]
        ?.split('')
        .reverse()
        .forEach((item: string, idx: number) => {
            if (!!idx && !(idx % 3) && idx !== bigArr[0]?.length) {
                intStr = item + delimiter + intStr
            } else {
                intStr = item + intStr
            }
        })

    if (Number(decimal)) {
        if (decStr) {
            intStr += '.' + decStr
        }
    }

    return currencySymbol + negativeNChar + intStr
}
