export enum VMType {
    EVM = 'EVM',
    ZKLITEVM = 'ZKLITEVM',
    CAIROVM = 'CAIROVM',
    IMXVM = 'IMXVM',
    LPRVM = 'LPRVM',
    ZKSPVM = 'ZKSPVM',
    SOLANAVM = 'SOLANAVM',
    TVM = 'TVM',
    BTCVM = 'BTCVM',
    TRONVM = 'TRONVM',
    FUELVM = 'FUELVM',
    SUIVM = 'SUIVM'
}

export abstract class BaseBalance {
    abstract fetchBalanceWithRetry(chainInfo: any, address: string, tokenAddress?: string): Promise<bigint | undefined>;
    abstract getBalance(url: string, address: string): Promise<bigint>;
    abstract getTokenBalance(url: string, address: string, tokenAddress: string): Promise<bigint>;
}
