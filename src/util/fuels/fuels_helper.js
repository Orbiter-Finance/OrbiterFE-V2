import { Fuel } from 'fuels'

const connect = async () => {
  console.log('Fuel', Fuel)
  // const fuel = new Fuel()

  // await fuel.selectConnector('Fuel Wallet')
  // await fuel.connect()
}

const fuelsHelper = {
  connect,
}

export default fuelsHelper
