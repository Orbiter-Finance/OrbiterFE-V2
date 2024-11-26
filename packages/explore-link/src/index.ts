import { ChainConfig, BlockchainConfigs } from './config.interface';
import orbiterMainnetChains from './chains.json';
import orbiterTestnetChains from './testnet.json';
import { ExplorerFactory } from './explorer.factory';
import { EventEmitter } from 'events';
export * from './config.interface';
export enum Endpoint {
    mainnet = 'mainnet',
    testnet = 'testnet'
}
export const ENDPOINT_URL = {
    'mainnet': 'https://cdn.orbiter.finance/config/chains-explore.json',
    'testnet': 'https://testnet-cdn.orbiter.finance/config/chains-explore.json'
}
export class ExploreLinkProvider extends EventEmitter {
    private blockchainConfigs: BlockchainConfigs = {};
    private isLoadRemoteConfig: boolean = false;
    private remoteEndpoint: string = '';
    constructor(public readonly endpoint: Endpoint | 'mainnet' | 'testnet' | string) {
        super();
        const endpointName = endpoint as string;
        this.remoteEndpoint = endpointName;
        if (Object.keys(ENDPOINT_URL).includes(endpointName)) {
            if (endpointName === 'mainnet') {
                this.blockchainConfigs = orbiterMainnetChains.reduce((acc, chain) => {
                    acc[chain.chainId] = chain as ChainConfig;
                    return acc;
                }, {} as { [key: string]: ChainConfig });
            } else if (endpointName === 'testnet') {
                this.blockchainConfigs = orbiterTestnetChains.reduce((acc, chain) => {
                    acc[chain.chainId] = chain as ChainConfig;
                    return acc;
                }, {} as { [key: string]: ChainConfig });
            }
            this.remoteEndpoint = ENDPOINT_URL[endpointName === 'mainnet' ? 'mainnet' : "testnet"];
        }
        if (this.remoteEndpoint && this.remoteEndpoint.includes('http')) {
            this._getRemoteConfig().then(result => {
                this.emit('ready', result);
            }).catch(error => {
                console.log('request remote config error', error);
                this.emit('error', error);
            })
        }

    }
    // Load configurations from both the local file and an external API
    private async _getRemoteConfig(): Promise<ChainConfig[]> {
        let remoteConfig: ChainConfig[] = [];
        try {
            let response = await fetch(this.remoteEndpoint);
            if (!response.ok) {
                throw new Error(`Failed to fetch chains from API: ${response.statusText}`);
            }
            remoteConfig = await response.json();
            if (remoteConfig && Array.isArray(remoteConfig)) {
                remoteConfig.forEach(chain => {
                    this.blockchainConfigs[chain.chainId] = chain;
                });
            }
        } catch (error) {
            console.error('Failed to load chains from API:', error);
        } finally {
            this.isLoadRemoteConfig = true;
        }
        return remoteConfig;
    }

    private getRecommendExploreConfig(chainId: string) {
        const config: ChainConfig | undefined = this.blockchainConfigs[chainId];
        if (config && config?.explorers && config?.explorers.length > 0) {
            return config?.explorers[0];
        }
        return null;
    }
    public getChain(chainId: string): ChainConfig | undefined {
        const config: ChainConfig | undefined = this.blockchainConfigs[chainId];
        return config
    }
    public getChains(): BlockchainConfigs {
        return this.blockchainConfigs;
    }
    public async getChainAsync(chainId: string): Promise<ChainConfig | undefined> {
        if (!this.isLoadRemoteConfig) {
            await this._getRemoteConfig();
        }
        const config: ChainConfig | undefined = this.blockchainConfigs[chainId];
        return config
    }
    public async getChainsAsync(): Promise<BlockchainConfigs> {
        if (!this.isLoadRemoteConfig) {
            await this._getRemoteConfig();
        }
        return this.blockchainConfigs;
    }
    public async getChainsListAsync(): Promise<Array<ChainConfig>> {
        if (!this.isLoadRemoteConfig) {
            await this._getRemoteConfig();
        }
        const chains: ChainConfig[] = [];
        Object.keys(this.blockchainConfigs).forEach((chainId, index) => {
            const chain = this.blockchainConfigs[chainId];
            chain && chains.push(chain);
        })
        return chains

    }
    public getAccountLink(chainId: string, account: string): string {
        const config = this.getRecommendExploreConfig(chainId);
        if (!config) throw new Error(`No explorers available for chain: ${chainId}`);
        const explorer = ExplorerFactory.createExplorer(config);
        return explorer.getAccountLink(account);
    }

    public getTokenLink(chainId: string, token: string): string {
        const config = this.getRecommendExploreConfig(chainId);
        if (!config) throw new Error(`No explorers available for chain: ${chainId}`);
        const explorer = ExplorerFactory.createExplorer(config);
        return explorer.getTokenLink(token);
    }

    public getTransactionLink(chainId: string, txHash: string): string {
        const config = this.getRecommendExploreConfig(chainId);
        if (!config) throw new Error(`No explorers available for chain: ${chainId}`);
        const explorer = ExplorerFactory.createExplorer(config);
        return explorer.getTransactionLink(txHash);
    }

    public async addBlockchain(chainId: string, config: ChainConfig): Promise<void> {
        this.blockchainConfigs[chainId] = config;
    }
}
export default ExploreLinkProvider;
