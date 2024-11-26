import React from 'react'
import useWatchUserTransactionStatus from '../hooks/useWatchUserTransactionStatus'

function WatchUserTransactionStatusAtom() {
  useWatchUserTransactionStatus()
  return (
    null
  )
}

export default React.memo(WatchUserTransactionStatusAtom)