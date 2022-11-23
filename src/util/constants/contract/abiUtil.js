import { sha3 } from "web3-utils";
import AbiCoder from "web3-eth-abi";
import BigNumber from "bignumber.js";
/* eslint-disable */
export const IERC20_ABI_JSON = [];
export const ZKSYNC2_ABI_JSON = [];
export const Forward_ABI = [];
import { XVM_ABI } from "./contract";
/* eslint-enable */
const ABIMap = new Map();
ABIMap.set("IERC20", {
  json: IERC20_ABI_JSON,
  map: ABIToMapping(IERC20_ABI_JSON),
});
ABIMap.set("Forward", {
  json: Forward_ABI,
  map: ABIToMapping(Forward_ABI),
});
ABIMap.set("XVM", {
  json: XVM_ABI,
  map: ABIToMapping(XVM_ABI),
});

export function ABIToMapping(abi) {
  try {
    const abiMap = new Map();
    for (const abiItem of abi) {
      if (abiItem.name) {
        const signHex = sha3(
          `${abiItem.name}(${abiItem.inputs.map(ABIInputToString).join(",")})`,
        );
        if (signHex) {
          abiMap.set(
            abiItem.type === "event" ? signHex.slice(2) : signHex.slice(2, 10),
            abiItem,
          );
        }
      }
    }
    return abiMap;
  } catch (error) {
    throw new Error(`Disassembly ABI failed ${error.message}`);
  }
}
export function ABIInputToString(
  input,
) {
  if (input.type.includes("tuple")) {
    return `(${input.components.map(ABIInputToString).join(",")})`;
  }
  return input.type;
}

export function decodeMethod(input, abiFile = "XVM") {
  if (!ABIMap.has(abiFile)) {
    abiFile = "XVM";
    // throw new Error(`${abiFile} Abi Name Not Exists`)
  }
  const abiItems = ABIMap.get(abiFile)?.map;
  if (!abiItems) {
    throw new Error(`${abiFile} Abi Name items Not Exists`);
  }
  const signId = input.slice(2, 10);
  const abiItem = abiItems.get(signId);
  if (!abiItem) {
    return null;
  }
  const result = {
    name: abiItem.name,
    params: [],
  };
  const decodeResult = (AbiCoder)["decodeParameters"](
    abiItem.inputs,
    input.slice(10),
  );
  for (let index = 0; index < decodeResult.__length__; index++) {
    const element = decodeResult[index];
    let values = element;
    const isUint = abiItem.inputs[index].type.includes("uint");
    const isInt = abiItem.inputs[index].type.includes("int");
    const isAddress = abiItem.inputs[index].type.includes("address");
    if (isUint || isInt) {
      if (Array.isArray(element)) {
        values = element.map(val => new BigNumber(val).toString());
      } else {
        values = new BigNumber(element).toString();
      }
    }
    // Addresses returned by web3 are randomly cased so we need to standardize and lowercase all
    if (isAddress) {
      if (Array.isArray(element)) {
        values = element.map(el => el.toLowerCase());
      } else {
        values = element.toLowerCase();
      }
    }
    result.params.push({
      name: abiItem.inputs[index].name,
      value: values,
      type: abiItem.inputs[index].type,
    });
  }
  return result;
}


/**
 *
 * @param input
 * @returns
 name: string;
 transferData: {
    maker: string;
    token: string;
    value: BigNumber;
    data: {
      toChainId: number;
      toTokenAddress: string;
      toWalletAddress: string;
      toExpectValue: BigNumber;
    };
  };
 */
export function decodeInputXVMContractTransfer(input) {
  const callFuncNameSign = input.substring(0, 10);
  const xvmNameSigns = ["0x471824f7"];
  const decodeInputData = decodeMethod(
      String(input),
      "XVM",
  );
  const result = {
    name: "",
    transferData: {},
    data: {},
  };
  if (!decodeInputData || !decodeInputData.params) {
    return result;
  }
  result.name = decodeInputData.name;
  decodeInputData.params.forEach((el) => {
    const filedName = el.name.replace("_", "");
    result.data[filedName] = el.value;
    result[filedName] = el;
  });
  if (xvmNameSigns.includes(callFuncNameSign)) {
    // Forward Contract
    switch (callFuncNameSign) {
      case "0x471824f7": // swap
        result.transferData.maker = result.maker.value;
        result.transferData.token = result.token.value;
        result.transferData.value = new BigNumber(result.value.value);
        result.transferData.data = {};
        const data = result.data.value;
        result.transferData.data.toChainId = +data[0];
        result.transferData.data.toTokenAddress = data[1];
        result.transferData.data.toWalletAddress = data[2];
        result.transferData.data.toExpectValue = new BigNumber(data[3]);
        break;
    }
  }
// delete result.data;
  return result;
}