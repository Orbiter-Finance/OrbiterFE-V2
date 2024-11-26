
import { Interface } from "ethers6";


export const combiRaw = (funcName: string, callFunc: string, callArgs: any[]) => {
    const ifaceERC20 = new Interface([
        callFunc
    ]);
    const raw = ifaceERC20.encodeFunctionData(funcName, callArgs);

   


    return raw;
};

export const approveEnCode = (callArgs: any[]) => {

    const raw = combiRaw("approve", "function balanceOf(address,uint256)", callArgs)


    return raw;
};


export const balanceEnCode = (callArgs: any[]) => {

    const raw = combiRaw("balanceOf", "function balanceOf(address)", callArgs)

    return raw;
};
