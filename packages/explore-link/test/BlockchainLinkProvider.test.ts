import { Endpoint, ExploreLinkProvider } from './../src/index';
import { describe, it, expect,vi } from 'vitest';
import { ChainConfig } from '../src/config.interface';
describe('BlockchainLinkProvider', () => {
  // Test for getAccountLink
  const provider = new ExploreLinkProvider(Endpoint.mainnet);
  it('should emit "loaded" event after successfully loading remote configs', async () => {
    global.fetch = vi.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ chainId: '1', explorers: [] }]),
        } as Response)
    );
    const loadedSpy = vi.fn();
    provider.on('ready', loadedSpy);
    await new Promise((resolve) => provider.on('ready', resolve));

    expect(loadedSpy).toHaveBeenCalled();
});
  it('should return the correct account link for Ethereum', async () => {
    const chainId = '1'; // Ethereum
    const account = '0x1234567890abcdef1234567890abcdef12345678';
    const expectedLink = 'https://etherscan.io/address/0x1234567890abcdef1234567890abcdef12345678';

    const result = provider.getAccountLink(chainId, account);
    expect(result).toBe(expectedLink);
  });

  // Test for getTokenLink
  it('should return the correct token link for Ethereum', async () => {
    const chainId = '1'; // Ethereum
    const token = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
    const expectedLink = 'https://etherscan.io/token/0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

    const result = provider.getTokenLink(chainId, token);
    expect(result).toBe(expectedLink);
  });

  // Test for getTransactionLink
  it('should return the correct transaction link for Ethereum', async () => {
    const chainId = '1'; // Ethereum
    const txHash = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef';
    const expectedLink = 'https://etherscan.io/tx/0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef';

    const result = provider.getTransactionLink(chainId, txHash);
    expect(result).toBe(expectedLink);
  });

  // Test for unsupported chain ID
  it('should throw an error for unsupported chain ID', async () => {
    const unsupportedChainId = '99999'; // Unsupported Chain ID
    const account = '0x1234567890abcdef1234567890abcdef12345678';
    expect(() => provider.getAccountLink(unsupportedChainId, account)).toThrowError(`No explorers available for chain: ${unsupportedChainId}`);
  });

  // Test for adding a new blockchain config
  it('should add a new blockchain config and return the correct account link', async () => {
    const newChainId = '123';
    const newChainConfig: ChainConfig = {
      chainId: '123',
      name: 'TestChain',
      vm: "TestVM",
      nativeCurrency: {
        symbol: "ETH",
        decimals: 18,
        name: "Ether"
      },
      rpc: [],
      explorers: [
        {
          name: 'Etherscan',
          url: 'https://testchain-explorer.io',
        },
      ],
    };

    await provider.addBlockchain(newChainId, newChainConfig);

    const account = '0x1234567890abcdef1234567890abcdef12345678';
    const expectedLink = 'https://testchain-explorer.io/address/0x1234567890abcdef1234567890abcdef12345678';

    const result = await provider.getAccountLink(newChainId, account);
    expect(result).toBe(expectedLink);
  });
  it('get chain info', async () => {
    const chainId = '1';
    const chainInfo = provider.getChain('1');
    expect(chainInfo).not.empty
    expect(chainInfo && chainInfo.chainId).eq(chainId)
  });
});