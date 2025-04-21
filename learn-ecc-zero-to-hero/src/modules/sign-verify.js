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
const signatureDEROutput = document.getElementById('signatureDER')
const signatureBase64Output = document.getElementById('signatureBase64')

// DOM Elements – Verify section
const verifyBtn = document.getElementById('verifyBtn')
const verifierPublicKey = document.getElementById('verifierPublicKey')
const verifyMessageInput = document.getElementById('verifyMessageInput')
// const verifyRInput = document.getElementById('verifyRInput')
// const verifySInput = document.getElementById('verifySInput')
const verificationOutput = document.getElementById('verificationOutput')

signBtn.addEventListener('click', () => {
  const msg = messageInput.value.trim()
  const privKeyHex = signerPrivateKey.value.trim()

  const result = signMessage(msg, privKeyHex)
  if (!result) return

  signatureROutput.textContent = result.r
  signatureSOutput.textContent = result.s
  publicKeyOutput.textContent = result.pubKey
  signatureDEROutput.textContent = result.derHex
  signatureBase64Output.textContent = result.derBase64
  verificationOutput.textContent = ''
  verificationOutput.style.color = 'initial'
})

// verifyBtn.addEventListener('click', () => {
//   const msg = verifyMessageInput.value.trim()
//   const pubKeyHex = verifierPublicKey.value.trim()
//   const r = verifyRInput.value.trim()
//   const s = verifySInput.value.trim()

//   const valid = verifySignature(msg, pubKeyHex, r, s)
//   if (valid === null) return

//   verificationOutput.textContent = valid
//     ? '✔ Signature is VALID for this message and public key.'
//     : '❌ Signature is INVALID.'
//   verificationOutput.style.color = valid ? 'green' : 'red'
// })
verifyBtn.addEventListener('click', () => {
  const msg = verifyMessageInput.value.trim()
  const pubKeyHex = verifierPublicKey.value.trim()
  const derInput = document.getElementById('verifySignatureDER').value.trim()

  if (!msg || !pubKeyHex || !derInput) {
    verificationOutput.textContent = '⚠ Please provide all required fields.'
    verificationOutput.style.color = 'orange'
    return
  }

  const sig = parseDERSignature(derInput)
  if (!sig) {
    verificationOutput.textContent = '⚠ Invalid DER signature format.'
    verificationOutput.style.color = 'orange'
    return
  }

  // Update visible parsed R/S values
  document.getElementById('verifyParsedR').textContent = sig.r
  document.getElementById('verifyParsedS').textContent = sig.s

  const valid = verifySignature(msg, pubKeyHex, sig.r, sig.s)
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
  const derBytes = Uint8Array.from(sig.toDER())
  const derHex = Array.from(derBytes).map(b => b.toString(16).padStart(2, '0')).join('')
  const derBase64 = btoa(String.fromCharCode(...derBytes))
  const pubKey = keyPair.getPublic().encode('hex')

  return { r, s, derHex, derBase64, pubKey }
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

/*
 NOTE: Expected ASN.1 DER format:
 SEQUENCE (0x30)
   INTEGER (0x02) <length of R>
     R value
   INTEGER (0x02) <length of S>
     S value
*/
function parseDERSignature(input) {
  try {
    const isBase64 = /^[A-Za-z0-9+/=]+$/.test(input) && input.length % 4 === 0
    const derBytes = isBase64
      ? Uint8Array.from(atob(input), c => c.charCodeAt(0))
      : hexToBytes(input)

    if (derBytes[0] !== 0x30) throw new Error('Invalid DER format: Expected SEQUENCE (0x30)')

    let offset = 2 // Skip 0x30 and length byte
    if (derBytes[offset] !== 0x02) throw new Error('Expected INTEGER (0x02) for R')

    const rLen = derBytes[offset + 1]
    const rBytesRaw = derBytes.slice(offset + 2, offset + 2 + rLen)
    // const rBytes = stripLeadingZeros(rBytesRaw)
    const rBytes = rBytesRaw
    const rHex = [...rBytes].map(b => b.toString(16).padStart(2, '0')).join('')
    const r = BigInt('0x' + rHex)
    offset += 2 + rLen

    if (derBytes[offset] !== 0x02) throw new Error('Expected INTEGER (0x02) for S')

    const sLen = derBytes[offset + 1]
    const sBytes = derBytes.slice(offset + 2, offset + 2 + sLen)
    const sBytesRaw = [...sBytes].map(b => b.toString(16).padStart(2, '0')).join('')
    // const sHex = stripLeadingZeros(sBytesRaw)
    const sHex = sBytesRaw
    const s = BigInt('0x' + sHex)

    if (r <= 0n || s <= 0n) throw new Error('Invalid signature values (negative or zero)')
    if (r >= ec.curve.n || s >= ec.curve.n) throw new Error('Signature values out of range')

    return { r: rHex, s: sHex, rBigInt: r, sBigInt: s }
  } catch (error) {
    console.error('Error parsing DER signature:', error)
    return null
  }
}

function hexToBytes(hex) {
  const cleaned = hex.replace(/^0x/, '').replace(/\s+/g, '').toLowerCase()
  if (!/^[0-9a-f]*$/.test(cleaned) || cleaned.length % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  return Uint8Array.from(cleaned.match(/.{2}/g).map(b => parseInt(b, 16)))
}

// function stripLeadingZeros(bytes) {
//   return bytes
// }
