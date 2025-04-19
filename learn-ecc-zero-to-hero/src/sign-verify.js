/* eslint-disable no-undef */
import { ec as EC } from 'elliptic'
import { sha256, toUtf8Bytes } from 'ethers'

const ec = new EC('secp256k1')

let currentSig = null
let currentPub = null

// DOM Elements
const messageInput = document.getElementById('messageInput')
const signBtn = document.getElementById('signBtn')
const verifyBtn = document.getElementById('verifyBtn')
const signatureOutput = document.getElementById('signatureOutput')
const verificationOutput = document.getElementById('verificationOutput')
const signerPrivateKey = document.getElementById('signerPrivateKey')

signBtn.addEventListener('click', () => {
  const msg = messageInput.value.trim()
  const privKeyHex = signerPrivateKey.value.trim()
  const result = signMessage(msg, privKeyHex)

  if (result) {
    const msgHash = sha256(toUtf8Bytes(msg)).slice(2)
    signatureOutput.textContent = `
        Message Hash: ${msgHash}\n
        Private Key: ${privKeyHex}\n
        Public Key: ${currentPub.encode('hex')}\n
        Signature: { r: ${result.r}, s: ${result.s} }
    `
    verificationOutput.textContent = ''
    verificationOutput.style.color = 'initial'
  }
})

verifyBtn.addEventListener('click', () => {
  const msg = messageInput.value.trim()
  const verified = verifyMessage(msg)
  if (verified === null) return

  verificationOutput.textContent = verified ? '✔ Signature is VALID for this message and public key.' : '❌ Signature is INVALID.'
  verificationOutput.style.color = verified ? 'green' : 'red'
})

export function signMessage(msg, privateKeyHex) {
  if (!msg || !isValidPrivateKey(privateKeyHex)) return null

  const keyPair = ec.keyFromPrivate(privateKeyHex, 'hex')
  const msgHash = sha256(toUtf8Bytes(msg)).slice(2)
  const sig = keyPair.sign(msgHash)
  const r = sig.r.toString('hex')
  const s = sig.s.toString('hex')

  currentSig = sig
  currentPub = keyPair.getPublic()

  return {
    r, s,
  }
}

export function verifyMessage(msg) {
  if (!msg || !currentSig || !currentPub) return null

  const msgHash = sha256(toUtf8Bytes(msg)).slice(2)
  return ec.verify(msgHash, currentSig, currentPub)
}

function isValidPrivateKey(hex) {
  return /^[0-9a-fA-F]{64}$/.test(hex)
}
