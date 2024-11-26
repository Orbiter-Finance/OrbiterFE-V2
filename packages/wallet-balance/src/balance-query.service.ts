import { Endpoint, ExploreLinkProvider } from '@orbiter-finance/explore-link';
import { createBalanceServiceByVM } from './utilt';

export class BalanceQueryService {
    static cacheService: Map<string, BalanceQueryService> = new Map();

    constructor(public readonly explorerProvider: ExploreLinkProvider) {}

    /**
     * Initializes the Explorer Provider and loads the specified network
     * @param endpoint Network type (default is mainnet)
     * @param timeout Optional timeout in milliseconds
     */
    static async initializeService(endpoint: Endpoint = Endpoint.mainnet, timeout = 1000 * 60 * 2): Promise<BalanceQueryService> {
        return new Promise((resolve, reject) => {
            if (BalanceQueryService.cacheService.has(endpoint)) {
                const cachedService = BalanceQueryService.cacheService.get(endpoint);
                if (cachedService) {
                    return resolve(cachedService);
                }
            }

            const explorerProvider = new ExploreLinkProvider(endpoint);

            const timeoutId = setTimeout(() => {
                reject(new Error(`Initialization timed out after ${timeout}ms`));
            }, timeout);

            explorerProvider.on('ready', () => {
                clearTimeout(timeoutId);
                const newService = new BalanceQueryService(explorerProvider);
                BalanceQueryService.cacheService.set(endpoint, newService);
                resolve(newService);
            });

            explorerProvider.on('error', (error: any) => {
                clearTimeout(timeoutId);
                reject(new Error(`Initialization failed: ${error.message || error}`));
            });
        });
    }

    /**
     * Retrieves chain information with caching mechanism
     * @param chainId Unique identifier for the blockchain
     * @throws If the chain information is not initialized or doesn't exist
     */
    private retrieveChainInfo(chainId: string): any {
        if (!this.explorerProvider) {
            throw new Error('Explorer Provider is not initialized. Call `initializeService()` first.');
        }
        const chainInfo = this.explorerProvider.getChain(chainId);
        if (!chainInfo) {
            throw new Error(`Chain with ID ${chainId} not found.`);
        }
        return chainInfo;
    }

    /**
     * Retrieves the native token balance of the specified chain
     * @param chainId Unique identifier of the blockchain
     * @param address Address to query the balance for
     * @returns The retrieved balance (if available)
     */
    async getNativeBalance(chainId: string, address: string): Promise<bigint | undefined> {
        if(!chainId ||!address) {
          throw new Error('invalid params');
        }
        const chainInfo = this.retrieveChainInfo(chainId);
        const balanceService = createBalanceServiceByVM(chainInfo.vm);
        if(!balanceService) {
          throw new Error(`creacte balanceService for ${chainId} fail, Not Support for VMType: ${chainInfo.vm}`);
        }
        return balanceService?.fetchBalanceWithRetry(chainInfo, address);
    }

    /**
     * Retrieves the balance of a specified token on a given chain
     * @param chainId Unique identifier of the blockchain
     * @param address Address to query the balance for
     * @param tokenAddress The contract address of the token to query
     * @returns The retrieved token balance (if available)
     */
    async getTokenBalance(chainId: string, address: string, tokenAddress: string): Promise<bigint | undefined> {
        if(!chainId || !address || !tokenAddress) { 
          throw new Error('invalid params');
        }
        const chainInfo = this.retrieveChainInfo(chainId);
        const balanceService = createBalanceServiceByVM(chainInfo.vm);
        if(!balanceService) {
          throw new Error(`creacte balanceService for ${chainId} fail, Not Support for VMType: ${chainInfo.vm}`);
        }
        return balanceService?.fetchBalanceWithRetry(chainInfo, address, tokenAddress);
    }
}

export default BalanceQueryService;