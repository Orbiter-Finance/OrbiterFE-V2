import { ChainId, convertPublicKey2 } from "@loopring-web/loopring-sdk"

export interface UpdateAccountRequestV3 {
    exchange: string;
    owner: string;
    accountId: number;
    publicKey: {
        x: string;
        y: string;
    };
    maxFee: {
        tokenId: string | number;
        volume: string;
    };
    validUntil: number;
    nonce: number;
    eddsaSignature?: string;
    ecdsaSignature?: string;
    hashApproved?: string;
    keySeed?: string;
}

export function addHexPrefix(input: any) {
    if (typeof input === 'string') {
      return input.startsWith('0x') ? input : '0x' + input
    }
    throw new Error('Unsupported type')
  }


export function getUpdateAccountEcdsaTypedData(data: UpdateAccountRequestV3, chainId: ChainId) {
    const message: any = {
        owner: data.owner,
        accountID: data.accountId,
        feeTokenID: data.maxFee.tokenId,
        maxFee: data.maxFee.volume,
        publicKey: addHexPrefix(convertPublicKey2(data.publicKey).toString(16)),
        validUntil: data.validUntil,
        nonce: data.nonce,
    }

    const typedData = {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            AccountUpdate: [
                { name: 'owner', type: 'address' },
                { name: 'accountID', type: 'uint32' },
                { name: 'feeTokenID', type: 'uint16' },
                { name: 'maxFee', type: 'uint96' },
                { name: 'publicKey', type: 'uint256' },
                { name: 'validUntil', type: 'uint32' },
                { name: 'nonce', type: 'uint32' },
            ],
        },
        primaryType: 'AccountUpdate',
        domain: {
            name: 'Loopring Protocol',
            version: '3.6.0',
            chainId,
            verifyingContract: data.exchange,
        },
        message: message,
    }

    return typedData
}

export function sortObjDictionary(obj: { [key: string]: any }): Map<string, any> {
    const dataToSig: Map<string, any> = new Map()
    if (obj) {
      Reflect.ownKeys(obj)
        .sort((a, b) => a.toString().localeCompare(b.toString()))
        .forEach((key) => {
          dataToSig.set(key.toString(), obj[key.toString()])
        })
    }
    return dataToSig
  }