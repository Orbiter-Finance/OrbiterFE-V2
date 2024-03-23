import { Connection, PublicKey } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token'

const rpc =
  'https://solana-devnet.g.alchemy.com/v2/t9lfb_P_pmAzmcUm0iaJydUhpLrjQx85'

const getConnection = () => {
  return new Connection(rpc, 'confirmed')
}

const getPublicKey = (address) => {
  return new PublicKey(address)
}

const getTokenAccount = async ({
  connection,
  fromPublicKey,
  tokenPublickey,
  toPublickey,
}) => {
  return await getOrCreateAssociatedTokenAccount(
    connection || getConnection(),
    fromPublicKey,
    tokenPublickey,
    toPublickey
  )
}

const solanaHelper = {
  getConnection,
  getPublicKey,
  getTokenAccount,
}

export default solanaHelper
