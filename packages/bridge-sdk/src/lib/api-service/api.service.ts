import { ENDPOINT, CDNENDPOINT } from "../orbiter.interface";
import { APIResponse, ChainConfig, PointRule, RouterConfig, Token } from "./api.interface";

export class ApiService {
  private apiEndpoint: ENDPOINT;
  private cdnEndpoint: CDNENDPOINT;
  private apiKey?: string;
  private channelId?: string;
  constructor(apiEndpoint: ENDPOINT, apiKey?: string, channelId?: string) {
    this.apiEndpoint = apiEndpoint;
    this.apiKey = apiKey;
    this.channelId = channelId;
    if(apiEndpoint == ENDPOINT.MAINNET) {
      this.cdnEndpoint = CDNENDPOINT.MAINNET
    } else {
      this.cdnEndpoint = CDNENDPOINT.TESTNET
    }
  }

  private async fetchAPIGet<T>(path: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.apiEndpoint}${path}`);
    if (params) {
      Object.keys(params).forEach(key => {
        const param = params[key];
        if (param) {
          url.searchParams.append(key, param);
        }
      });
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    headers['X-Channel'] = 'bridge-sdk';
    if (this.apiKey) headers['X-API-Key'] = this.apiKey;
    if (this.channelId) headers['X-Channel-ID'] = this.channelId;

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data: APIResponse<T> = await response.json();
    if (data.status !== 'success') {
      throw new Error(data.message);
    }

    return data.result;
  }

  private async fetchCDNGet<T>(path: string): Promise<T> {
    const url = new URL(`${this.cdnEndpoint}${path}`);
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as T;
    return data;
  }

  async getChainList(): Promise<ChainConfig[]> {
    let chainConfigs: ChainConfig[] = [];
    try {
      chainConfigs = await this.fetchAPIGet<ChainConfig[]>('/chains');
    } catch(error) {
      console.log(`getChainList From API Fail, will try cdn backup`);
      chainConfigs = await this.fetchCDNGet<ChainConfig[]>('/chains.json');
    }
    return chainConfigs;
  }

  async getTokenList(): Promise<Record<string, Token[]>> {
    return await this.fetchAPIGet<Record<string, Token[]>>('/tokens');
  }

  async getRouterList(dealerId?: string): Promise<RouterConfig[]> {
    const entry = "contract";
    let routers: RouterConfig[] = [];
    try {
      routers = await this.fetchAPIGet<RouterConfig[]>('/routers/v2', dealerId ? { dealerId, entry } : { entry });
    } catch(error) {
      console.log(`getRouterList From API Fail, will try cdn backup`);
      routers = await this.fetchCDNGet<RouterConfig[]>('/routers.json');
    }
    return routers;
  }

  async getBasePointRules(): Promise<PointRule> {
    return await this.fetchAPIGet<PointRule>('/routers/base-point');
  }

  async getSimulatedReceiveAmount(
    line: string,
    value: string,
    nonce?: string,
    dealer?: string,
    brokerageTradeFeeRate?: number
  ): Promise<{ receiveAmount: string; router: RouterConfig }> {
    return await this.fetchAPIGet<{ receiveAmount: string; router: RouterConfig }>('/routers/simulation/receiveAmount', {
      line,
      value,
      nonce,
      dealer,
      brokerageTradeFeeRate,
    });
  }

  async getTransactionHistory(address: string, offset?: number): Promise<any> {
    return await this.fetchAPIGet<any>('/transaction/history', { address, offset });
  }

  async getTransactionStatus(hash: string, chainId?: string, address?: string, value?: string): Promise<any> {
    return await this.fetchAPIGet<any>(`/transaction/status/${hash}`, { chainId, address, value });
  }

  async getUserOpoint(address: string): Promise<any> {
    return await this.fetchAPIGet<any>(`/opoints/user/${address}`);
  }
}

