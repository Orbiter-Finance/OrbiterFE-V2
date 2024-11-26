import React from 'react'
import PointsCardModal from './PointsCardModal'
import PointsRank from './PointsRank'
import UserPointDetails from './UserPointDetails'
import UrlParamsUpdateBridgeRule from './UrlParamsUpdateBridgeRule'
import ToasterAtom from './ToasterAtom'
// import WatchUserTransactionStatusAtom from './WatchUserTransactionStatusAtom'

function PageModalGroup() {

    return (
        <>
            <UrlParamsUpdateBridgeRule />
            <PointsRank />
            <PointsCardModal />
            <UserPointDetails />
            <ToasterAtom />
            {/* <WatchUserTransactionStatusAtom /> */}
        </>
    )
}
export default React.memo(PageModalGroup)