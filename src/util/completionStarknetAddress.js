export default function completionStarknetAddress(address) {
  let str = address

  if (address.length > 42 && address.length < 66) {
    str = str.slice(2)

    for (let index = 0; index < 66 - address.length; index++) {
      str = '0' + str
    }
  }

  const ipfsRegExp = /^0x.*/

  if (!ipfsRegExp.test(str) && str) {
    str = '0x' + str
  }
  return str
}
