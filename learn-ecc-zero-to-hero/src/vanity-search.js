/* eslint-disable no-undef */
import { ec as EC } from 'elliptic'
import { bech32 } from '@scure/base'
import { keccak256, getBytes, sha256 } from 'ethers'
import { ripemd160 } from '@noble/hashes/ripemd160'
import bs58 from 'bs58'

const ec = new EC('secp256k1')

// DOM Elements
// Vanity Search Inputs
const vanityPrefixInput = document.getElementById('vanityPrefix')
const vanityBtn = document.getElementById('vanityBtn')
const vanityStopBtn = document.getElementById('vanityStopBtn')

// Vanity Search Output
const vanityStatusOutput = document.getElementById('vanityStatus')
const vanityAddressOutput = document.getElementById('vanityAddress')
const vanityPrivateKeyOutput = document.getElementById('vanityPrivateKey')
const vanityAttemptsOutput = document.getElementById('vanityAttempts')
const vanityElapsedTimeOutput = document.getElementById('vanityElapsedTime')

let isVanityRunning = false
vanityStopBtn.addEventListener('click', () => {
  if (isVanityRunning) {
    isVanityRunning = false
    vanityStatusOutput.textContent = 'stopped'
  }
})
vanityBtn.addEventListener('click', startVanitySearch)

function startVanitySearch() {
  const prefix = vanityPrefixInput.value.trim()
  if (!prefix) return alert('Enter a prefix to search')

  const isEth = prefix.startsWith('0x')
  const isBtcP2PKH = prefix.startsWith('1')
  const isBtcP2SH = prefix.startsWith('3')
  const isBtcP2WPKH = prefix.startsWith('bc1q')
  const isBtcP2TR = prefix.startsWith('bc1p')

  console.log('Searching for prefix:', prefix)
  console.log('isEth:', isEth)
  console.log('isBtcP2PKH:', isBtcP2PKH)
  console.log('isBtcP2SH:', isBtcP2SH)
  console.log('isBtcP2WPKH:', isBtcP2WPKH)
  console.log('isBtcP2TR:', isBtcP2TR)
  if (!isEth && !isBtcP2PKH && !isBtcP2SH && !isBtcP2WPKH && !isBtcP2TR) {
    return alert('Invalid prefix! Must start with 0x (ETH), 1 (BTC P2PKH), 3 (BTC P2SH), or bc1 (BTC Bech32)')
  }
  if (prefix.length < 2) {
    return alert('Prefix too short! Must be at least 2 characters.')
  }
  if (prefix.length > 42) {
    return alert('Prefix too long! Must be at most 42 characters.')
  }

  isVanityRunning = true
  vanityStatusOutput.textContent = 'running'
  vanityElapsedTimeOutput.textContent = '...'
  vanityPrivateKeyOutput.textContent = '...'
  vanityAddressOutput.textContent = '...'

  const start = Date.now()
  let attempts = 0

  function loop() {
    if (!isVanityRunning) return

    const privKey = crypto.getRandomValues(new Uint8Array(32))
    const privHex = Array.from(privKey).map(b => b.toString(16).padStart(2, '0')).join('')
    const keyPair = ec.keyFromPrivate(privHex, 'hex')
    const pubPoint = keyPair.getPublic()

    let address = ''
    if (isEth) {
      const pubX = pubPoint.getX().toString('hex').padStart(64, '0')
      const pubY = pubPoint.getY().toString('hex').padStart(64, '0')
      const rawBytes = getBytes('0x' + pubX + pubY)
      address = '0x' + keccak256(rawBytes).slice(-40)
    } else if (isBtcP2PKH) {
      const compressedPubKey = getCompressedPubKey(pubPoint)
      const pubkeyBytes = hexToBytes(compressedPubKey)
      const pubkeyHash = hash160(pubkeyBytes)
      address = toBase58Check(pubkeyHash, 0x00) // P2PKH legacy (starts with 1)
    } else if (isBtcP2SH) {
      const compressedPubKey = getCompressedPubKey(pubPoint)
      const pubkeyBytes = hexToBytes(compressedPubKey)
      const pubkeyHash = hash160(pubkeyBytes)
      const segwitScript = new Uint8Array([0x00, 0x14, ...pubkeyHash])
      const redeemHash = hash160(segwitScript)
      address = toBase58Check(redeemHash, 0x05) // P2SH-P2WPKH (starts with 3)
    }  else if (isBtcP2WPKH) {
      const compressedPubKey = getCompressedPubKey(pubPoint)
      const pubkeyBytes = hexToBytes(compressedPubKey)
      const pubkeyHash = hash160(pubkeyBytes)
      address = P2WPKH(pubkeyHash)
    } else if (isBtcP2TR) {
      alert('Taproot (P2TR) address generation is not implemented yet.')
      return
    } else {
      const compressedPubKey = getCompressedPubKey(pubPoint)
      const pubkeyBytes = hexToBytes(compressedPubKey)
      const pubkeyHash = hash160(pubkeyBytes)
      address = toBase58Check(pubkeyHash, 0x00) // Default fallback
    }

    attempts++

    // Check if the generated address matches the prefix
    if (address.toLowerCase().startsWith(prefix.toLowerCase())) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(2)

      isVanityRunning = false
      vanityStatusOutput.textContent = 'found'
      vanityAddressOutput.textContent = address
      vanityPrivateKeyOutput.textContent = privHex
      vanityAttemptsOutput.textContent = attempts
      vanityElapsedTimeOutput.textContent = `${elapsed}s`

      return
    }

    // Update the UI with the current attempt
    vanityAddressOutput.textContent = address
    vanityPrivateKeyOutput.textContent = privHex

    // Real-time update every 10 attempts
    if (attempts % 10 === 0) {
      vanityAttemptsOutput.textContent = attempts
      const elapsed = ((Date.now() - start) / 1000).toFixed(2)
      vanityElapsedTimeOutput.textContent = `${elapsed}s`
    }

    setTimeout(loop, 0)
  }

  loop()
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

const P2WPKH = (hash) => {
  const words = bech32.toWords(hash)
  words.unshift(0x00) // witness version 0
  return bech32.encode('bc', words)
}
