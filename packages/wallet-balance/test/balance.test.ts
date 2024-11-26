import { describe, it, expect } from 'vitest';
import { BalanceQueryService } from '../src/index'
import { Endpoint } from '@orbiter-finance/explore-link';

describe('balance test', async () => {
  const service = await BalanceQueryService.initializeService(Endpoint.mainnet);

  it.skip('test BTCVM ', async () => {
    const balance = await service.getNativeBalance("FRACTAL_TEST", "bc1qe86uygaezrr4dq3wzmps7ep9c2gqzvzdm58zyz");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("FRACTAL_TEST", "bc1qe86uygaezrr4dq3wzmps7ep9c2gqzvzdm58zyz", "bc1qnhan2jnyg79avsx3szw9h5v93zvnfdx99lu8d5");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  });

  it('test CAIROVM ', async () => {
    const balance = await service.getNativeBalance("SN_MAIN", "0x0679816dc458a3a733baedf9b39b29ae86a16e178c7bfa6c226abc515778de6b");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("SN_MAIN", "0x0679816dc458a3a733baedf9b39b29ae86a16e178c7bfa6c226abc515778de6b", "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  });

  it('test EVM', async () => {
    const balance = await service.getNativeBalance("1", "0x6081258689a75d253d87cE902A8de3887239Fe80");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("1", "0x6081258689a75d253d87cE902A8de3887239Fe80", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  });

  it('test FUEL', async () => {
    const balance = await service.getNativeBalance("FUEL_MAIN", "0xC2AE6765Cde0014706aB41Bc99Dd5Bd83555CF9E9f6E5E5524E9d8C293cb697a");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("FUEL_MAIN", "0xC2AE6765Cde0014706aB41Bc99Dd5Bd83555CF9E9f6E5E5524E9d8C293cb697a", "0x286c479da40dc953bddc3bb4c453b608bba2e0ac483b077bd475174115395e6b");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  });

  it('test IMXVM', async () => {
    const balance = await service.getNativeBalance("immutableX", "0x45604a7e44759c6269aff60505b32ccd5445c103");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("immutableX", "0x45604a7e44759c6269aff60505b32ccd5445c103", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  });

  it('test LPRVM', async () => {
    const balance = await service.getNativeBalance("loopring", "0x646592183ff25a0c44f09896a384004778f831ed");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("loopring", "0x646592183ff25a0c44f09896a384004778f831ed", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  }, {timeout: 300000});

  it('test SOLANAVM', async () => {
    const balance = await service.getNativeBalance("SOLANA_MAIN", "CQeiRUWQLzbSXqGjFbwh4cT7D9tqQcGbRY5CXa2sWK4w");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("SOLANA_MAIN", "CQeiRUWQLzbSXqGjFbwh4cT7D9tqQcGbRY5CXa2sWK4w", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  });

  it('test SUI', async () => {
    const balance = await service.getNativeBalance("SUI_MAIN", "0xf3bfda04092a842d4c57c61f9d8fb99058792ab2622b2a0c0d83a6ea41de325f");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("SUI_MAIN", "0xf3bfda04092a842d4c57c61f9d8fb99058792ab2622b2a0c0d83a6ea41de325f", "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  });

  it('test TON', async () => {
    const balance = await service.getNativeBalance("TON", "UQBN1z9drcrBbuKgJMYBQdV4c58XymfTooTZ3aZJzdc2IHHN");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("TON" , "UQBN1z9drcrBbuKgJMYBQdV4c58XymfTooTZ3aZJzdc2IHHN", "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  });

  it('test TRONVM', async () => {
    const balance = await service.getNativeBalance("728126428", "TMV3pXsZTvCXE5PBN2kdVbNbfCRXMpUYTt");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("728126428", "TMV3pXsZTvCXE5PBN2kdVbNbfCRXMpUYTt", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  });

  it('test ZKLITEVM', async () => {
    const balance = await service.getNativeBalance("zksync", "0x41d3d33156ae7c62c094aae2995003ae63f587b3");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("zksync", "0x41d3d33156ae7c62c094aae2995003ae63f587b3", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  });

  it('test ECLIPSE', async () => {
    const balance = await service.getNativeBalance("ECLIPSE_MAIN", "A8oen4pwnBUJXGto1iUW3V4xoykY9VDfcrS9YKqouzMv");
    console.log(balance);
    expect(balance).toBeDefined();

    const tokenBalance = await service.getTokenBalance("ECLIPSE_MAIN", "A8oen4pwnBUJXGto1iUW3V4xoykY9VDfcrS9YKqouzMv", "LaihKXA47apnS599tyEyasY2REfEzBNe4heunANhsMx");
    console.log(tokenBalance);
    expect(tokenBalance).toBeDefined();
  }, {timeout: 30 * 1000});

})