export function padStart(str: string, length: number, chars: string = ' '): string {
  const paddingLength = length - str.length;
  
  if (paddingLength <= 0) {
    return str;
  }

  const repeatedChars = chars.repeat(Math.ceil(paddingLength / chars.length));
  const padding = repeatedChars.slice(0, paddingLength);

  return padding + str;
}


export async function getTonOrbiterHash(chainId:string,hash:string) {
  const apiBase = chainId === 'TON' ? 'https://tonapi.io' : 'https://testnet.tonapi.io';
  const response = await fetch(`${apiBase}/v2/traces/${hash}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return data.children?.[0]?.transaction?.hash;
}