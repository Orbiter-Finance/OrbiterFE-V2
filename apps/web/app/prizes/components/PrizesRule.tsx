"use client"

import React, { useState } from 'react'
import Image from 'next/image'

import styles from "./PrizesRule.module.css"
import { cn } from '../../../utils/cn'

export default function PrizesRule() {
  const [extendKey, setExtendKey] = useState<number>()

  const rulesArray = [
    {
      title: '1. Which networks are participating in this event?',
      content: [
        <span className='o-prizes-reward o-font-500'> Round 1:</span>,
        <span>Bridge <span className='o-prizes-reward o-font-500'>from specific networks to Eclipse.</span></span>,
        <span> <span className='o-prizes-reward o-font-500' >Specific networks include:</span>Arbitrum、Base、Blast、BNB Chain、BOB、Ethereum、Gravity、Linea、Mode、Morph、Optimism、Polygon、Scroll、Taiko、World Chain、ZKSyncEra、Zora</span>,
        <span>The minimum amount required: ≥0.00055 ETH.</span>,
        <span>Bridge token: ETH</span>,
        <span className='o-prizes-reward o-font-500'> Round 2:</span>,
        <span>Bridge <span className='o-prizes-reward o-font-500'>from specific networks to World Chain or bridge from World Chain to specific networks.</span></span>,
        <span><span className='o-prizes-reward o-font-500'>Specific networks include:</span> Arbitrum、Base、Blast、BNB Chain、BOB、Ethereum、Eclipse、Gravity、IoTeX、Linea、Mode、Morph、Optimism、Polygon、Scroll、Taiko、ZKSyncEra、Zora</span>,
        <span>The minimum amount required: ≥0.00085 ETH.</span>,
        <span>Bridge token: ETH</span>,
        <span className='o-prizes-reward o-font-500'> Round 3:</span>,
        <span>Bridge <span className='o-prizes-reward o-font-500'>from specific networks to Arbitrum or bridge from Arbitrum to specific networks.</span></span>,
        <span><span className='o-prizes-reward o-font-500'>Specific networks include:</span>Polygon、OPBNB、BOB、ZKSyncEra、Manta、Ethereum、Blast、Zora、Optimism、Cyber、Linea、BNB Chain、World Chain、Matchain、Mantle、Scroll、Zircuit、Solana、Mode、Morph、Base、Lisk、Sui</span>,
        <span>Bridge token: ETH、USDC、USDT</span>,
        <span className='o-prizes-reward o-font-500'> Round 4:</span>,
        <span>Bridge <span className='o-prizes-reward o-font-500'>from specific networks to Sui.</span></span>,
        <span><span className='o-prizes-reward o-font-500'>Specific networks include:</span>Taiko、BNB Chain、Base、Optimisim、Arbitrum、 Linea、Polygon、BOB、Ethereum、Scroll、ZKSyncEra</span>,
        <span>Bridge token: USDC</span>,
      ]
    },
    {
      title: '2. What is Orbiter License and how to collect different Orbiter Licenses?',
      content: [
        <span> <span className='o-prizes-reward o-font-500' >Basic Licenses:</span> Complete <span className='o-prizes-reward o-font-500' >≥15 transactions</span> per round. You can collect one Basic License and enter the prize pool for the current round.</span>,
        <span> <span className='o-prizes-reward o-font-500' >Supreme Licenses:</span> Supreme Licenses are only available during specific periods and can only be obtained through <span className='o-prizes-reward o-font-500' >Lucky Draw.</span></span>,
        <span> <span className='o-prizes-reward o-font-500' >Fast Pass:</span> A Fast Pass can directly enter into the Final Prize Pool and can only be obtained through <span className='o-prizes-reward o-font-500' >Lucky Draw.</span></span>,
        <span> <span className='o-prizes-reward o-font-500' >NOTE: </span>Orbiter Licenses can be considered as a voucher for participation in this event and may also serve as a credential for loyal Orbiter users in the future.</span>
      ]
    },
    {
      title: '3. How to Participate in the Lucky Draw?',
      content: [
        <span> Bridge 1 tx to earn 1 entry for the lucky draw. A maximum of 10 entries per address per day.</span>,
        <span> Earn 1 entry for the lucky draw with each transaction. A maximum of 10 entries per address per day.</span>,
        <span> Unused entries do not roll over to the next day.</span>,
        <span> The prize pool includes O-points, Supreme passes, Fast Pass, and $USDC rewards, which may vary at different times. </span>
      ]
    },
    {
      title: '4. How to Enter and Share the Prize Pool?',
      content: [
        <span> Collecting one <span className='o-prizes-reward o-font-500' >Basic License </span> grants eligibility for the prize pool for the current round, which represents 15% of the total prize pool for each round.</span>,
        <span> Gathering <span className='o-prizes-reward o-font-500' >five licenses (including Basic and Supreme licenses)</span> or obtaining one Fast Pass grants entry to the final prize pool, which represents 25% of the total prize pool.</span>,
        <span> <span className='o-prizes-reward o-font-500' >Total Prize Pool Amount:</span> The initial prize pool amount is <span className='o-prizes-reward o-font-500' >$60,000</span> (based on an initial participant count of <span className='o-prizes-reward o-font-500' >10,000</span>). For each additional 1,000 participants over the initial 10,000, the prize pool will increase by $1,200, <span className='o-prizes-reward o-font-500' >up to a maximum limit of $100,000 USDC.</span></span>,
        <span> <span className='o-prizes-reward o-font-500' >Note:</span> During the event period, the top 3 users' (rank by transaction) <span className='o-prizes-reward o-font-500' >96% bridging fees</span> (except for gas fees) will be rebated.</span>
      ]
    },
    {
      title: '5. When will the rewards be distributed?',
      content: [
        <span> O-points rewards will be credited to your Orbiter O-points account within a few minutes.</span>,
        <span> Other rewards will be distributed after the event ends.</span>,
        <span> Please stay informed and claim your rewards within 3 days of the reward claim portal opening!</span>
      ]
    },
    {
      title: '6. The final interpretation rights of the activity are owned by Orbiter Finance.',
      content: [
        <span></span>
      ]
    },
  ]

  const handleExtendClick = (extendIndex: number) => {
    if (extendIndex === extendKey) {
      setExtendKey(undefined)
    } else {
      setExtendKey(extendIndex)
    }
  }


  return (
    <div>
      <h2 className='text-3xl font-semibold text-center mb-8 mt-14 o-font-600'>Terms and Conditions</h2>
      <div className={cn('p-8 border-2 border-[rgba(69,35,48,0.6)] rounded-xl', styles.sectionBgColor)}>
        {rulesArray.map((rule, index) => {
          return (
            <div key={index} className='mt-8 first:mt-0'>
              <div onClick={() => handleExtendClick(index)} className='flex justify-between items-center mt-1 text-base font-semibold leading-6 cursor-pointer'>
                <div className='o-font-500'>{rule.title}</div>
                <Image src="/assets/icon/prizes/extends.svg" style={{ rotate: index === extendKey ? "180deg" : "0deg", willChange: "rotate", transition: "all 0.3s" }} alt="" width={24} height={24} className='w-6 h-6 ml-2' />
              </div>
              <div className='text-sm font-400 leading-7' style={{ display: index === extendKey ? "block" : "none" }}>
                {
                  rule.content.map((option, idx) => {
                    return <p key={idx} className='mt-2 ml-4'>
                      {option}
                    </p>
                  })
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}