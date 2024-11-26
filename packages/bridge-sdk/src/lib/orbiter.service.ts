import { VMType } from "@orbiter-finance/vm-core";
import { VMServiceFactory } from "./vm-service/vm.factory";
import { ConfigService } from "./config.service";
import { Token, Transaction, ChainConfig, RouterConfig } from "./api-service/api.interface"
import { ApiService } from "./api-service/api.service";
import { Chain, ConfigOptions, TradePair, RouterType } from "./orbiter.interface";
import { Router } from "./router.service";
import { getTonOrbiterHash } from "../utils/tools";

export class OrbiterClient {
  private readonly _config: ConfigOptions
  private readonly _apiService: ApiService;
  private readonly _configService: ConfigService;
  private readonly _VMServiceFactory: VMServiceFactory;
  private readonly _defaultRouterType: RouterType;

  constructor(config: ConfigOptions) {
    this._config = config;
    this._apiService = new ApiService(this._config.apiEndpoint, this._config.apiKey, this._config.channelId);
    this._configService = new ConfigService(this._apiService, config);
    this._VMServiceFactory = new VMServiceFactory(this._configService);
    this._defaultRouterType = this._config.defaultRouterType || RouterType.CONTRACT;
  }

  async init() {
    await this._configService.initConfig();
  }

  static async create(config: ConfigOptions): Promise<OrbiterClient> {
    const client = new OrbiterClient(config);
    await client.init();
    return client;
  }

  createRouter(tradePair: TradePair): Router {
    const srcChainConfig = this._configService.getChainConfigById(tradePair.srcChainId);
    if (!srcChainConfig) {
      throw new Error(`createRouter fail, error: unavailable source chainId: ${tradePair.srcChainId}.`);
    }
    const srcVMService = this._VMServiceFactory.getVMService(srcChainConfig.vm);
    if (!srcVMService) {
      throw new Error(`createRouter fail, error: unavailable source chain vm type: ${srcChainConfig.vm}.`);
    }
    const srcToken = srcChainConfig.tokens.find(token => {
      return token.symbol === tradePair.srcTokenSymbol;
    })
    if (!srcToken) {
      throw new Error(`createRouter fail, error: unavailable source token: ${tradePair.srcTokenSymbol}.`);
    }
    const dstChainConfig = this._configService.getChainConfigById(tradePair.dstChainId);
    if (!dstChainConfig) {
      throw new Error(`createRouter fail, error: unavailable destination chainId: ${tradePair.dstChainId}.`);
    }
    const dstToken = dstChainConfig.tokens.find(token => {
      return token.symbol === tradePair.dstTokenSymbol;
    })
    if (!dstToken) {
      throw new Error(`createRouter fail, error: unavailable destination token: ${tradePair.srcTokenSymbol}.`);
    }
    const routerConfig = this._configService.getRouterConfig(tradePair);
    if (!routerConfig) {
      throw new Error(`createRouter fail, error: unavailable router, line: '${tradePair.srcChainId}/${tradePair.dstChainId}-${tradePair.srcTokenSymbol}/${tradePair.dstTokenSymbol}.`);
    }

    const availableRouterTypes: RouterType[] = [];
    let firstRouterType = tradePair.routerType || this._defaultRouterType;
    if(this.checkTradePairType(srcChainConfig, dstChainConfig, routerConfig, firstRouterType)) {
      availableRouterTypes.push(firstRouterType);
    }
    const secondaryRouterType = (firstRouterType == RouterType.EOA) ? RouterType.CONTRACT : RouterType.EOA;
    if(this.checkTradePairType(srcChainConfig, dstChainConfig, routerConfig, secondaryRouterType)) {
      availableRouterTypes.push(secondaryRouterType);
    }
    if(availableRouterTypes.length == 0) {
      throw new Error(`createRouter fail, error: no available router type, line: '${tradePair.srcChainId}/${tradePair.dstChainId}-${tradePair.srcTokenSymbol}/${tradePair.dstTokenSymbol}.`);
    }

    const basePoint = this._configService.getBasePointRule(tradePair.dstChainId, tradePair.dstTokenSymbol);
    const channelId = this._config.channelId?.indexOf('official-') == 0 ? undefined : this._config.channelId;
    return new Router(srcChainConfig, srcToken, dstChainConfig, dstToken, basePoint, srcVMService, routerConfig, availableRouterTypes, channelId);
  }

  private checkTradePairType(srcChainConfig: ChainConfig, dstChainConfig: ChainConfig, routerConfig: RouterConfig, routerType: RouterType) {
    if(routerType == RouterType.EOA) {
      if (srcChainConfig.vm == dstChainConfig.vm
        || (srcChainConfig.vm == VMType.EVM && [VMType.LPRVM, VMType.ZKLITEVM, VMType.ZKSPVM, VMType.IMXVM].includes(dstChainConfig.vm))
        || (dstChainConfig.vm == VMType.EVM && [VMType.LPRVM, VMType.ZKLITEVM, VMType.ZKSPVM, VMType.IMXVM].includes(srcChainConfig.vm))
        || [VMType.TVM, VMType.SOLANAVM, VMType.FUELVM].includes(srcChainConfig.vm)
      ) {
        return true;
      }
    } else if(routerType == RouterType.CONTRACT) {
      if (routerType == RouterType.CONTRACT
        && routerConfig.endpointContract
      ) {
        return true;
      }
    }
    return false;
  }

  getAllChains(): Chain[] {
    const chainConfigs = this._configService.getChainConfigs();
    return [...chainConfigs.map(chainConfig => {
      return {
        id: chainConfig.chainId,
        name: chainConfig.name
      }
    })]
  }

  getAllSymbols(): string[] {
    const chains = this.getAllChains();
    const symbols: Set<string> = new Set();
    chains.forEach(chain => {
      const tokens = this.getAvailableTokens(chain.id);
      tokens.forEach(token => {
        symbols.add(token.symbol);
      })
    });
    return [...symbols];
  }

  getChainConfig(chainId: string): ChainConfig | undefined {
    return this._configService.getChainConfigById(chainId);
  }

  getAvailableTokens(chainId: string): Token[] {
    const chainConfig = this._configService.getChainConfigById(chainId);
    let availableTokens: Token[] = [];
    if (chainConfig) {
      const routerConfigs = this._configService.getRouterConfigs();
      const availableRouters = routerConfigs.filter(routerConfig => {
        return routerConfig.srcChain === chainConfig.chainId;
      })

      const availableTokenAddresses = availableRouters.map(availableRouter => {
        return availableRouter.srcToken;
      })

      availableTokens = chainConfig.tokens.filter(token => {
        return availableTokenAddresses.includes(token.address);
      })
    }
    return availableTokens;
  }

  getAllTradePairs(): TradePair[] {
    const routerConfigs = this._configService.getRouterConfigs();
    const tradePairs: TradePair[] = [];
    routerConfigs.forEach(router => {
      const srcChainConfig = this._configService?.getChainConfigById(router.srcChain);
      const dstChainConfig = this._configService?.getChainConfigById(router.tgtChain);
      if (dstChainConfig) {
        const srcToken = srcChainConfig?.tokens.find(token => {
          return token.address === router.srcToken;
        });
        const dstToken = dstChainConfig?.tokens.find(token => {
          return token.address === router.tgtToken;
        });

        if (srcChainConfig && dstChainConfig && srcToken && dstToken) {
          // if (srcChainConfig?.vm == dstChainConfig.vm
          //   || (srcChainConfig?.vm == VMType.EVM && [VMType.LPRVM, VMType.ZKLITEVM, VMType.ZKSPVM].includes(dstChainConfig.vm))
          //   || (dstChainConfig?.vm == VMType.EVM && [VMType.LPRVM, VMType.ZKLITEVM, VMType.ZKSPVM].includes(srcChainConfig.vm))
          //   || [VMType.TVM, VMType.SOLANAVM, VMType.FUELVM].includes(srcChainConfig.vm)
          // ) {
          //   tradePairs.push({
          //     srcChainId: router.srcChain,
          //     dstChainId: router.tgtChain,
          //     srcTokenSymbol: srcToken.symbol,
          //     dstTokenSymbol: dstToken.symbol,
          //     routerType: RouterType.EOA
          //   })
          // }
          // if (router.endpointContract) {
          //   tradePairs.push({
          //     srcChainId: router.srcChain,
          //     dstChainId: router.tgtChain,
          //     srcTokenSymbol: srcToken.symbol,
          //     dstTokenSymbol: dstToken.symbol,
          //     routerType: RouterType.CONTRACT
          //   })
          // }
          tradePairs.push({
            srcChainId: router.srcChain,
            dstChainId: router.tgtChain,
            srcTokenSymbol: srcToken.symbol,
            dstTokenSymbol: dstToken.symbol,
          })
        }
      }
    })

    return tradePairs;
  }

  getAvailableTradePairs(srcChainId?: string, srcTokenSymbol?: string): TradePair[] {
    const targetTradePairs: TradePair[] = this.getAllTradePairs().filter(tradePair => {
      if (srcChainId && tradePair.srcChainId!=srcChainId) {
        return false;
      }
      if (srcTokenSymbol && tradePair.srcTokenSymbol!=srcTokenSymbol) {
        return false;
      }
      return true;
    })

    return targetTradePairs;
  }

  async getTransactionHistory(address: string, offset: number = 0): Promise<{
    count: number,
    rows: Transaction[],
    offset: number,
    limit: number
  }> {
    return await this._apiService.getTransactionHistory(address, offset);
  }

  async getTransactionStatus(hash: string, chainId?: string, address?: string, value?: string): Promise<{
    chainId: string,
    hash: string,
    sender: string,
    receiver: string,
    amount: string,
    symbol: string,
    timestamp: string,
    status: number,
    opStatus: number,
    targetId: string,
    targetAmount: string,
    targetSymbol: string,
    targetChain: string
  }> {
    if (chainId?.includes("TON")) {
      // Patch: fix tonhash inconsistency issue
      try {
        hash = await getTonOrbiterHash(chainId, hash);
      } catch (error) {
        const e = error as Error;
        console.error(`getTonOrbiterHash error ${e.message}`);
      }
    }
    return await this._apiService.getTransactionStatus(hash, chainId, address, value);
  }

  async getUserOpoint(address: string): Promise<{
    address: string,
    summary: {
      [key: string]: number
    },
    points: number
  }> {
    return await this._apiService.getUserOpoint(address);
  }
}
