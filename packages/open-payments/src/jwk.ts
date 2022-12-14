import { createPublicKey, generateKeyPairSync, KeyObject } from 'crypto'
import { JWK } from './types'

export const generateJwk = ({
  privateKey: providedPrivateKey,
  keyId
}: {
  privateKey?: KeyObject
  keyId: string
}): JWK => {
  if (!keyId.trim()) {
    throw new Error('KeyId cannot be empty')
  }

  const privateKey = providedPrivateKey
    ? providedPrivateKey
    : generateKeyPairSync('ed25519').privateKey

  const jwk = createPublicKey(privateKey).export({
    format: 'jwk'
  })

  if (jwk.crv !== 'Ed25519' || jwk.kty !== 'OKP') {
    throw new Error('Key is not EdDSA-Ed25519')
  }

  return {
    alg: 'EdDSA',
    kid: keyId,
    kty: jwk.kty,
    crv: jwk.crv,
    x: jwk.x
  }
}