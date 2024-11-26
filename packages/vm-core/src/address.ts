import { VMType } from "./constant";
import { validateAndParseAddress } from "starknet";
import { TronWeb } from "tronweb";
import * as bitcoin from "bitcoinjs-lib";
import TonWeb from "tonweb";
// import base58 from 'bs58';

export async function isValidAddress(address: string, vm: VMType): Promise<boolean> {
    switch (vm) {
        case VMType.EVM:
            return isEVMAddress(address);
        case VMType.BTCVM:
            return isBTCAddress(address); 
        case VMType.CAIROVM:
            return isCAIROAddress(address); 
        case VMType.FUELVM:
            return isFUELAddress(address);
        case VMType.IMXVM:
            return isIMXAddress(address);
        case VMType.LPRVM:
            return isLPRAddress(address); 
        case VMType.SOLANAVM:
            return await isSOLANAAddress(address);
        case VMType.TVM:
            return isTONAddress(address);        
        case VMType.TRONVM:
            return isTRONAddress(address);
        case VMType.ZKLITEVM:
            return isZKLITEAddress(address);
        case VMType.APTOSVM:
            return isAPTOSAddress(address);
        case VMType.SUIVM:
            return isSUIAddress(address);
        default:
            throw new Error(`Unsupported VMType: ${vm}`);
    }
}

export function isEVMAddress(address: string): boolean {
    try {
        return (address.startsWith('0x') && address.length == 42);
    } catch {
        return false;
    }
}

export function isBTCAddress(address: string): boolean {
    try {
        if(!address || address == '') {
            return false;
        }
        bitcoin.address.toOutputScript(address, bitcoin.networks.bitcoin);
        return true;
    } catch (e) {
        return false;
    }
}

export function isCAIROAddress(address: string) {
    try {
        if(!address || address.length <= 53) {
            return false;
        }
        const parsedAddress = validateAndParseAddress(address);
        return parsedAddress? true : false;
    } catch (error) {
        return false;
    } 
}

export function isFUELAddress(address: string) {
    return address.length === 66 && /(0x)[0-9a-f]{64}$/i.test(address);
}

export function isIMXAddress(address: string) {
    return isEVMAddress(address);
}

export function isLPRAddress(address: string) {
    return isEVMAddress(address);
}

export async function isSOLANAAddress(address: string): Promise<boolean> {
  try {
    const base58 = await import('bs58');
      const decoded = base58.decode(address);
      return decoded.length >= 32 && decoded.length <= 44;
  } catch {
      return false;
  }
}

export function isTONAddress(address: string) {
  try {
    if(!address || address == '') {
      return false;
    }
    const parsedAddress = new TonWeb.Address(address);
    return parsedAddress? true : false;
  } catch (error) {
    return false;
  }
}

export function isTRONAddress(address: string) {
  if(!address || address == '') {
    return false;
  }
  return TronWeb.isAddress(address);
}

export function isZKLITEAddress(address: string) {
  return isEVMAddress(address);
}

export function isAPTOSAddress(address: string) {
  try {
    return (address.startsWith('0x') && address.length == 66);
  } catch {
      return false;
  }
}

export function isSUIAddress(address: string) {
  return isAPTOSAddress(address);
}