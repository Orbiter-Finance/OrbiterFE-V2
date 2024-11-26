import { ReactNode } from "react"
import { HOSTtENVIRONMENT, VM } from "../constant";

export interface WalletType {
    address: string
    chainId: string
    chainName: string
    vm: VM[];
    switchChain(chain:string): void;
    getBalance(params:{chainId:string, token: string, user: string, isMainnet?: boolean}):Promise<string>
    connect():void;
    disConnectAsync():void;
    checkAddress(address: string): boolean;
    checkChain(chainId: string): boolean;
    transfer(params: any):Promise<string>;
    walletIcon: string
    walletId: string
    walletName: string
    isMainnet: boolean
    emitGas: ()=> Promise<string>
    type: string
    defaultChain: string
    disabled?: boolean
}

export interface TotasParmasType {
    title: ReactNode,
    viceTitle?: ReactNode,
    linkLabel?: ReactNode,
    link?: string
    timer?: number
}

export type totasFn = (parmas: TotasParmasType) => void

export interface WalletTotasType {
    totas?: {
        sucess: totasFn,
        error: totasFn,
        info: totasFn,
        warn: totasFn
    }
}

export interface WalletProviderConfigType extends WalletTotasType {
    isMainnet: boolean,
    hostEnvironment?: HOSTtENVIRONMENT
    ton: {
        rpc: string,
        key: string,
    },
    disbaledVm?: VM[]
}

export interface OrbiterToken {
    symbol: string
    address: string
    decimals: number
}