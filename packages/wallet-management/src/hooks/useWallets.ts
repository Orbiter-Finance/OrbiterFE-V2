import React from 'react';
import { useEVM } from './useEVM';
import { useStarknet } from './useStarknet';
import { useSolana } from './useSolana';
import { useTon } from './useTon';
import { useTron } from './useTron';
import { WalletType } from '../types';
import { useSui } from './useSui'
import { useFuels } from './useFuels'


export function useWallets() {
  const list: WalletType[] = [
    useEVM(),
    useStarknet(),
    useSolana(),
    useTon(),
    useTron(),
    useFuels(),
    useSui()
  ]
  return list;
}
