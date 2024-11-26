import React from 'react'
import BalanceAtom from '../components/HooksAtomCom/BalanceAtom'
import { Page } from './Page'
import GasFeeAtom from '../components/HooksAtomCom/GasFeeAtom'
import { Modal } from '../components/Modal.js'
import PageAtomCom from 'src/components/PageAtomCom'

const BridgePage = React.memo(() => {
  return (
    <div className='w-full'>
      <BalanceAtom />
      <GasFeeAtom />
      <Page />
      <Modal />
      <PageAtomCom />
    </div>
  )
})

export {
  BridgePage
}