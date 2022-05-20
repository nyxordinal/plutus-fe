import NodeRSA from "node-rsa"

const publicKey: string = process.env.NEXT_PUBLIC_KEY || ''
const RSAEncrypter: NodeRSA = new NodeRSA(publicKey)

export const encryptPayload = (password: string, serverTimestamp: number): string => {
    return RSAEncrypter.encrypt(`${password}:${serverTimestamp}`, 'base64')
}