import React from 'react'
import { useTransactionStatus } from '../../hooks/useTransactionStatus'

const TransactionAtom = () => {
  useTransactionStatus()
  return (
    null
  )
}

export default React.memo(TransactionAtom)
