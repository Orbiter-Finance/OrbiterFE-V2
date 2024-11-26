import React from 'react'
import { atom } from 'jotai'
import ExploreLinkProvider from '@orbiter-finance/explore-link'
import { FeeEstimator } from '@orbiter-finance/blockchain-gas'
import { OrbiterClient } from '@orbiter-finance/bridge-sdk'

export const pageIsMobileAtom = atom(false)
export const orbiterExploreAtom = atom<ExploreLinkProvider | null>(null)
export const orbiterClientAtom = atom<OrbiterClient | null>(null)
export const orbiterFeeEstimatorAtom = atom<FeeEstimator | null>(null)
