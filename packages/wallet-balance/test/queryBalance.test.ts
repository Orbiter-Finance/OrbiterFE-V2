import { Endpoint } from '@orbiter-finance/explore-link';
import { BalanceQueryService } from '../src/balance-query.service';
import { describe, it, expect } from 'vitest';
describe('QueryBalance', async() => {
    const query = await BalanceQueryService.initializeService(Endpoint.mainnet);
    // or new BalanceQueryService(new ExploreLink(...));
    it('should get native balance', async () => {
        const balance = await query.getNativeBalance('1', '0x80c67432656d59144ceff962e8faf8926599bcf8');
        expect(balance && balance>0n).toBe(true)
    });

    it('should get token balance', async () => {
        const balance = await query.getTokenBalance('1', '0x41d3d33156ae7c62c094aae2995003ae63f587b3', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
        expect(balance && balance>0n).toBe(true)
    });
});