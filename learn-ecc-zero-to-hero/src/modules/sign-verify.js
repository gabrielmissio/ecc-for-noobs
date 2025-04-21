/* eslint-disable no-undef */
import { ec as EC } from 'elliptic'
import { sha256, toUtf8Bytes } from 'ethers'

const ec = new EC('secp256k1')

// DOM Elements – Sign section
const messageInput = document.getElementById('messageInput')
const signerPrivateKey = document.getElementById('signerPrivateKey')
const signBtn = document.getElementById('signBtn')
const signatureROutput = document.getElementById('signatureR')
const signatureSOutput = document.getElementById('signatureS')
const publicKeyOutput = document.getElementById('generatedPublicKey')

// DOM Elements – Verify section
const verifyBtn = document.getElementById('verifyBtn')
const verifierPublicKey = document.getElementById('verifierPublicKey')
const verifyMessageInput = document.getElementById('verifyMessageInput')
const verifyRInput = document.getElementById('verifyRInput')
const verifySInput = document.getElementById('verifySInput')
const verificationOutput = document.getElementById('verificationOutput')

signBtn.addEventListener('click', () => {
  const msg = messageInput.value.trim()
  const privKeyHex = signerPrivateKey.value.trim()

  const result = signMessage(msg, privKeyHex)
  if (!result) return

  signatureROutput.textContent = result.r
  signatureSOutput.textContent = result.s
  publicKeyOutput.textContent = result.pubKey
  verificationOutput.textContent = ''
  verificationOutput.style.color = 'initial'
})

verifyBtn.addEventListener('click', () => {
  const msg = verifyMessageInput.value.trim()
  const pubKeyHex = verifierPublicKey.value.trim()
  const r = verifyRInput.value.trim()
  const s = verifySInput.value.trim()

  const valid = verifySignature(msg, pubKeyHex, r, s)
  if (valid === null) return

  verificationOutput.textContent = valid
    ? '✔ Signature is VALID for this message and public key.'
    : '❌ Signature is INVALID.'
  verificationOutput.style.color = valid ? 'green' : 'red'
})

export function signMessage(msg, privateKeyHex) {
  if (!msg || !isValidPrivateKey(privateKeyHex)) return null

  const keyPair = ec.keyFromPrivate(privateKeyHex, 'hex')
  const msgHash = sha256(toUtf8Bytes(msg)).slice(2)
  const sig = keyPair.sign(msgHash)

  const r = sig.r.toString('hex')
  const s = sig.s.toString('hex')
  const pubKey = keyPair.getPublic().encode('hex')

  return { r, s, pubKey }
}

export function verifySignature(msg, pubKeyHex, rHex, sHex) {
  if (!msg || !pubKeyHex || !rHex || !sHex) return null
  if (!/^04[0-9a-fA-F]{128}$/.test(pubKeyHex)) return null // uncompressed pubkey check

  const msgHash = sha256(toUtf8Bytes(msg)).slice(2)
  const pubKey = ec.keyFromPublic(pubKeyHex, 'hex')
  const sigObj = { r: rHex, s: sHex }

  return ec.verify(msgHash, sigObj, pubKey)
}

function isValidPrivateKey(hex) {
  return /^[0-9a-fA-F]{64}$/.test(hex)
}
