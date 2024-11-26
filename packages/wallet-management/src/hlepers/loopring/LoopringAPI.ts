import { 
    AmmpoolAPI, 
    DelegateAPI, 
    ExchangeAPI, 
    GlobalAPI, 
    NFTAPI, 
    UserAPI, 
    WalletAPI, 
    WsAPI,
    ChainId,
} from "@loopring-web/loopring-sdk";

export class LoopringAPI {

    chainId: ChainId

    baseApi = ""

    constructor (chainId: ChainId) {
        this.chainId = chainId

       this.baseApi =  Number(chainId) === 1 ? "https://api3.loopring.io" : "https://uat2.loopring.io"
    }

    public userAPI (): UserAPI {
        return new UserAPI({ chainId: this.chainId })
    };
    public exchangeAPI (): ExchangeAPI {
        return new ExchangeAPI({ chainId: this.chainId })
    };
    public globalAPI (): GlobalAPI {
        return new GlobalAPI({ chainId: this.chainId })
    };
    public ammpoolAPI (): AmmpoolAPI {
        return new AmmpoolAPI({ chainId: this.chainId })
    };
    public walletAPI (): WalletAPI {
        return new WalletAPI({ chainId: this.chainId })
    };
    public wsAPI (): WsAPI {
        return new WsAPI({ chainId: this.chainId })
    };
    public nftAPI (): NFTAPI {
        return new NFTAPI({ chainId: this.chainId })
    };
    public delegate (): DelegateAPI {
        return new DelegateAPI({ chainId: this.chainId })
    };
    
}

