import { ApiService } from "./api-service/api.service";
import { ConfigOptions, TradePair } from "./orbiter.interface";
import { ChainConfig, PointRule, RouterConfig, RouterState } from "./api-service/api.interface";

export class ConfigService {
  private _chainConfigs?: ChainConfig[];
  private _routerConfigs?: RouterConfig[];
  private _basePointRules?: PointRule;

  constructor(
    private readonly _apiService: ApiService,
    private readonly _config: ConfigOptions
  ) {}

  async initConfig() {
    try {
      const chainConfigs = await this._apiService.getChainList();
      this._chainConfigs = chainConfigs;
    } catch (error) {
      const e = error as Error;
      throw new Error(`init chainConfigs fail, error: ${e.message}, stack: ${e.stack}`);
    }
    try {
      const routerConfigs = await this._apiService.getRouterList(this._config.dealerId);
      this._routerConfigs = routerConfigs.filter(routerConfig => {
        return routerConfig.state === RouterState.AVAILABLE;
      });
    } catch (error) {
      const e = error as Error;
      throw new Error(`init routerConfigs fail, error: ${e.message}, stack: ${e.stack}`);
    }
    try {
      const basePointRules = await this._apiService.getBasePointRules();
      this._basePointRules = basePointRules;
    } catch (error) {
      const e = error as Error;
      console.error(`init basePointRules fail, error: ${e.message}`);
      this._basePointRules = {};
    }
  }

  getRouterConfigs() {
    if (!this._routerConfigs) {
      throw new Error(`getRouterConfigs fail, error: config need init.`);
    }
    return this._routerConfigs;
  }

  getRouterConfig(tradePair: TradePair): RouterConfig | undefined {
    if (!this._routerConfigs) {
      throw new Error(`getRouterConfig fail, error: config need init.`);
    }
    const line = `${tradePair.srcChainId}/${tradePair.dstChainId}-${tradePair.srcTokenSymbol}/${tradePair.dstTokenSymbol}`;

    return this._routerConfigs.find(router => {
      return router.line === line;
    })
  }

  getChainConfigs(): ChainConfig[] {
    if (!this._chainConfigs) {
      throw new Error(`getChainConfigs fail, error: config need init.`);
    }

    return this._chainConfigs;
  }

  getChainConfigByName(chainName: string): ChainConfig | undefined {
    if (!this._chainConfigs) {
      throw new Error(`getChainConfigByName fail, error: config need init.`);
    }

    const chainConfig = this._chainConfigs.find(chainConfig => {
      return chainConfig.name === chainName;
    })

    return chainConfig;
  }

  getChainConfigById(chainId: string): ChainConfig | undefined {
    if (!this._chainConfigs) {
      throw new Error(`getChainConfigById fail, error: config need init.`);
    }

    const chainConfig = this._chainConfigs.find(chainConfig => {
      return chainConfig.chainId === chainId;
    })

    return chainConfig;
  }

  getBasePointRule(chainId: string, symbol: string) {
    if(!this._basePointRules) {
      throw new Error(`getBasePointRule fail, error: config need init.`);
    }
    const chainRules = this._basePointRules[chainId];
    let basePoint = '0';
    if(chainRules) {
      basePoint = chainRules[symbol] || '0';
    }
    return basePoint;
  }
};
