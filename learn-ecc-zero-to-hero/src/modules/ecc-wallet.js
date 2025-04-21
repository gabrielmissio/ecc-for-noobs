/* eslint-disable no-undef */
import bs58 from 'bs58'
import { bech32 } from '@scure/base'
import { ec as EC } from 'elliptic'
import { ripemd160 } from '@noble/hashes/ripemd160'
import { Wallet, keccak256, getBytes, sha256 } from 'ethers'

const ec = new EC('secp256k1')

// DOM Elements
const privateKeyInput = document.getElementById('privateKeyInput')
const generateRandomBtn = document.getElementById('generateRandomBtn')
const generateBtn = document.getElementById('generateBtn')
const privateKeyField = document.getElementById('privateKey')
const publicKeyField = document.getElementById('publicKey')
const publicKeyXField = document.getElementById('publicKeyX')
const publicKeyYField = document.getElementById('publicKeyY')
const ethAddressField = document.getElementById('ethAddress')
const btcLegacyField = document.getElementById('btcLegacy')
const btcSegwitField = document.getElementById('btcSegwit')
const btcShSegwitField = document.getElementById('btcShSegwit')

generateBtn.addEventListener('click', generateAddress)
generateRandomBtn.addEventListener('click', generateRandomPrivateKey)

function isValidPrivateKey(hex) {
  return /^[0-9a-fA-F]{64}$/.test(hex)
}

// For educational purposes only, not secure
function generateRandomPrivateKey() {
  const randomBytes = new Uint8Array(32)
  window.crypto.getRandomValues(randomBytes)
  const privateKeyHex = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('')

  privateKeyInput.value = privateKeyHex
}

function generateAddress() {
  const privKeyHex = privateKeyInput.value.trim()
  if (!isValidPrivateKey(privKeyHex)) {
    alert('Invalid private key! Enter exactly 64 hex chars.')
    return
  }

  const keyPair = ec.keyFromPrivate(privKeyHex, 'hex')
  const pubPoint = keyPair.getPublic()
  const pubX = pubPoint.getX().toString('hex').padStart(64, '0')
  const pubY = pubPoint.getY().toString('hex').padStart(64, '0')
  const uncompressedPubKey = '0x04' + pubX + pubY

  const rawBytes = getBytes('0x' + pubX + pubY)
  const hash = keccak256(rawBytes)
  const ethAddress = '0x' + hash.slice(-40)

  const compressedPubKey = getCompressedPubKey(pubPoint)
  const pubkeyBytes = hexToBytes(compressedPubKey)

  const pubkeyHash = hash160(pubkeyBytes)
  const btcLegacy = toBase58Check(pubkeyHash, 0x00)
  const btcSegwit = toBech32Address(pubkeyHash)

  const segwitScript = new Uint8Array([0x00, 0x14, ...pubkeyHash])
  const redeemHash = hash160(segwitScript)
  const btcShSegwit = toBase58Check(redeemHash, 0x05)

  const ethersWallet = new Wallet(privKeyHex)
  const ethersPubKey = ethersWallet.signingKey.publicKey
  const ethersAddress = ethersWallet.address

  privateKeyField.textContent = privKeyHex
  publicKeyField.textContent = uncompressedPubKey
  publicKeyXField.textContent = pubX
  publicKeyYField.textContent = pubY
  ethAddressField.textContent = ethAddress
  btcLegacyField.textContent = btcLegacy
  btcSegwitField.textContent = btcSegwit
  btcShSegwitField.textContent = btcShSegwit

  if (ethersAddress.toLowerCase() === ethAddress.toLowerCase()) {
    console.log('%c✔ Ethereum address matches', 'color: green')
  } else {
    console.error('❌ Ethereum address mismatch')
  }

  if (ethersPubKey.toLowerCase() === uncompressedPubKey.toLowerCase()) {
    console.log('%c✔ Public key matches', 'color: green')
  } else {
    console.error('❌ Public key mismatch')
  }
}

function hexToBytes(hex) {
  hex = hex.replace(/^0x/, '')
  return Uint8Array.from(hex.match(/.{2}/g).map(b => parseInt(b, 16)))
}

function hash160(bytes) {
  const hash = sha256(bytes).slice(2)
  const shaBytes = hexToBytes(hash)
  return ripemd160(shaBytes)
}

const toBech32Address = (hash) => {
  const words = bech32.toWords(hash)
  words.unshift(0x00) // witness version 0
  return bech32.encode('bc', words)
}

function toBase58Check(payload, version) {
  const versioned = new Uint8Array([version, ...payload])
  const hash1 = sha256(versioned).slice(2)
  const hash2 = sha256(hexToBytes(hash1)).slice(2)
  const checksum = hexToBytes(hash2.slice(0, 8))
  const fullPayload = new Uint8Array([...versioned, ...checksum])
  return bs58.encode(fullPayload)
}

function getCompressedPubKey(pubPoint) {
  const x = pubPoint.getX().toString('hex').padStart(64, '0')
  const y = BigInt('0x' + pubPoint.getY().toString('hex'))
  const prefix = y % 2n === 0n ? '02' : '03'
  return prefix + x
}
