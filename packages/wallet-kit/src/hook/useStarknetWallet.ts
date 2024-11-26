// import { connect, disconnect } from "starknetkit"

export const useStarknetWallet = () => {

  const connectStarknetWallet = async () => {
    // await connect()
    console.log('conn==wallet')
  };

  return {
    // starknetWallet,
    connectStarknetWallet
  };
};