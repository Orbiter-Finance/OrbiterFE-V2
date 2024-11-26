"use client";
import { useState } from "react";
import {
  BalanceQueryService,
  exploreLink,
} from "@orbiter-finance/wallet-balance"; // Adjust the import path to your SDK
import { BigNumber } from "bignumber.js"; // Import BigNumber for better handling of BigInt values
import React from "react";
import { Endpoint } from "@orbiter-finance/explore-link"

const chains = [
  { name: "Ethereum Mainnet", id: "1" },
  { name: "Binance Smart Chain", id: "56" },
  { name: "Polygon", id: "137" },
  { name: "Arbitrum", id: "42161" },
  { name: "Avalanche", id: "43114" },
  { name: "Optimism", id: "10" },
];

export default function QueryBalancePage() {
  const [selectedChain, setSelectedChain] = useState<string>("1");
  const [address, setAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [nativeBalance, setNativeBalance] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleQueryBalance = async () => {
    const queryBalance = await BalanceQueryService.initializeService(
      Endpoint.mainnet
    );
    setLoading(true);
    setError(null);
    setNativeBalance(null);
    setTokenBalance(null);

    try {
      const nativeResult = await queryBalance.getNativeBalance(
        selectedChain,
        address
      );
      setNativeBalance(
        nativeResult ? BigNumber(nativeResult.toString()).toString() : "0"
      );

      if (tokenAddress) {
        const tokenResult = await queryBalance.getTokenBalance(
          selectedChain,
          address,
          tokenAddress
        );
        setTokenBalance(
          tokenResult ? BigNumber(tokenResult.toString()).toString() : "0"
        );
      }
    } catch (err: any) {
      setError(err.message || "Error fetching balance");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Query Blockchain Balance
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Select Chain:
          </label>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Address:
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter wallet address"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Token Address (optional):
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="ERC20 Token Address"
          />
        </div>

        <button
          onClick={handleQueryBalance}
          disabled={loading || !address}
          className={`w-full py-2 rounded text-white font-semibold transition-all ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : "Query Balance"}
        </button>

        {nativeBalance && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Native Balance (Main Coin):
            </h2>
            <p className="text-gray-600">{nativeBalance}</p>
          </div>
        )}

        {tokenBalance && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Token Balance:
            </h2>
            <p className="text-gray-600">{tokenBalance}</p>
          </div>
        )}

        {error && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-red-600">Error:</h2>
            <p className="text-red-500">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
