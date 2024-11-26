"use client";

import React, { useCallback, useMemo } from "react";
import {
  useAccount,
  useConnectUI,
  useDisconnect,
  useIsConnected,
  useWallet,
} from "@fuels/react";
import { Address, toBech32 } from "fuels";
import { VM } from "../constant";
import { WalletType } from "../types";

export function useFuels(): WalletType {
  const type = "Fuel";

  // Hooks
  const { connect } = useConnectUI();
  const { isConnected } = useIsConnected();
  const { disconnect } = useDisconnect();
  const account = useAccount();
  const { wallet } = useWallet();

  /**
   * Switch Chain Logic
   */
  const switchChain = useCallback(() => {
    console.log("Switch chain logic not implemented yet");
  }, []);

  /**
   * Address Memoization
   */
  const address = useMemo(() => {
    if (isConnected && account) {
      try {
        return new Address((account as any)?.data).toHexString();
      } catch (error) {
        console.error("Error converting account data to address:", error);
      }
    }
    return "";
  }, [isConnected, account]);

  /**
   * Check Chain Compatibility
   */
  const checkChain = useCallback(() => {
    // Extend logic as needed for chain validation
    return true;
  }, []);

  /**
   * Get Balance
   */
  const getBalance = async () => {
    return ""
  }


  /**
   * Emit Gas Placeholder
   */
  const emitGas = useCallback(async () => {
    // Extend with actual gas emission logic
    return "";
  }, []);

  /**
   * Validate Address
   */
  const checkAddress = useCallback((address: string): boolean => {
    try {
      const bech32Address = toBech32(address);
      new Address(bech32Address);
      return !!address && true;
    } catch (error) {
      console.error("Invalid address:", error);
      return false;
    }
  }, []);

  /**
   * Transfer Funds
   */
  const transfer = useCallback(
    async ({
      params,
      value,
      makerAddress,
      token,
      ...rest
    }: any): Promise<string> => {
      const tokenAddress = token.address
      try {
        const res = await wallet?.transfer(makerAddress, value, tokenAddress, {
          scriptData: params,
        } as any);
        return res?.id || "";
      } catch (error) {
        console.error("Error during transfer:", error);
        return "";
      }
    },
    [wallet]
  );

  /**
   * Disconnect Wallet
   */
  const disConnectAsync = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Error during disconnect:", error);
    }
  }, [disconnect]);

  // Return the structured wallet type
  return {
    address,
    chainId: "", // Extend as needed
    chainName: "", // Extend as needed
    vm: [VM.FUELVM],
    switchChain,
    getBalance,
    connect,
    checkAddress,
    transfer,
    walletId: "",
    walletName: "",
    walletIcon: "",
    disConnectAsync,
    isMainnet: false,
    emitGas,
    type,
    checkChain,
    defaultChain: "FUEL_MAIN",
  };
}
