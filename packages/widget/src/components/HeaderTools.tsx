import React from 'react'
import { ConnectWallet } from './ConnectWallet.js'
export function HeaderTools() {
  return (
    <div className='flex justify-end items-center'>
      <ConnectWallet />
    </div>
  )
}
