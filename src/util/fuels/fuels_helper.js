import { Fuel } from 'fuels'
import { FuelWalletConnector } from '@fuels/connectors'

const connect = async () => {
  const fuel = new Fuel({
    connectors: [new FuelWalletConnector()],
  })

  await fuel.selectConnector('Fuel Wallet')
  await fuel.connect()
}

const fuelsHelper = {
  connect,
}

export default fuelsHelper
