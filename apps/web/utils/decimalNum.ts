
import { BigNumber } from "bignumber.js"

const DEC = ["", "K", "M", "B", "T"]



export const decimalNum = (num: string | number = 0, decimal?: string | number, delimiter = "", currencySymbol = "") => {

    decimal ??= 2

    const big = num ? new BigNumber(num).toFixed() : "0"

    const negativeNChar = Number(big) < 0 ? "-" : ""

    const bigArr = ((Number(big) < 0) ? big.slice(1) : big)?.toString().split(".")
    let intStr = ''
    let decStr = bigArr[1]?.slice(0, Number(decimal)) || ""

    while (!Number(decStr[decStr.length - 1]) && !!decStr) {
        decStr = decStr.slice(0, decStr.length - 1)
    }
    bigArr[0]?.split("").reverse().forEach((item: string, idx: number) => {
        if (!!idx && !(idx % 3) && (idx !== (bigArr[0]?.length))) {
            intStr = item + delimiter + intStr
        } else {
            intStr = item + intStr
        }
    })

    if (Number(decimal)) {
        if (decStr) {
            intStr += "." + decStr
        }
    }

    return currencySymbol + negativeNChar + intStr
}


export const decimalNumRedundancy = (num: string | number = 0, decimal?: string | number, delimiter = "", currencySymbol = "") => {

    decimal ??= 2


    const value = decimalNum(num, Number(decimal), delimiter, currencySymbol)


    const str = value.replaceAll(currencySymbol, "")

    const str1 = str.replaceAll(delimiter, "")

    let decStr = "0."
    let handleData = false

    for (let index = 0; index < (Number(decimal) - 1); index++) {
        decStr += "0"
    }

    if (!!Number(Number(decimal)) && !!Number(num?.toString()) && !Number(str1?.toString())) {
        decStr += "1"
        handleData = true
    }

    return handleData ? `<${decimalNum(decStr, Number(decimal), "", currencySymbol)}` : value
}


export const decimalNumTh = (num: string | number = 0, decimal?: string | number, delimiter = "", currencySymbol = "") => {


    const val = decimalNum(num, decimal, delimiter)

    let value = val

    const strA = val.split(delimiter)

    const len = strA.length

    if (len > 1) {


        value = [strA[0], strA[1]].join(".") + DEC[len - 1]
    }

    return currencySymbol + value

}

export const decimalNumDec = (num: string | number = 0, decimal?: string | number, delimiter = "", currencySymbol = "") => {


    const val = decimalNum(num, decimal, delimiter)

    let value = val

    const strA = val.split(delimiter)

    const len = strA.length

    if (len > 1) {

        value = decimalNum([strA[0], strA[1]].join("."), decimal) + DEC[len - 1]
    }

    return currencySymbol + value

}

export const decimalNumLine = (num: string | number, decimal?: string | number, delimiter = "", currencySymbol = "") => {


    const isEmptyValue = typeof num === "undefined" || num === ""

    return isEmptyValue ? "--" : decimalNum(num, Number(decimal), delimiter, currencySymbol)
} 