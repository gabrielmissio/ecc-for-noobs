import fs from 'fs/promises'
import { parentPort, workerData } from 'worker_threads'
import elliptic from 'elliptic'
import { sha256 } from 'ethereum-cryptography/sha256'
import { ripemd160 } from '@noble/hashes/ripemd160'
import { bech32 } from '@scure/base'
import bs58 from 'bs58'
import path from 'path'
import { fileURLToPath } from 'url'

const { ec: EC } = elliptic
const ec = new EC('secp256k1')

const { workerId, totalWorkers } = workerData
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const CONFIG_FILE = path.join(rootDir, 'config.json')
const SAVE_FILE = path.join(rootDir, `progress-worker-${workerId}.json`)
const MATCHES_FILE = path.join(rootDir, `matches-worker-${workerId}.json`)
const MATCH_PREFIX = path.join(rootDir, `match-${workerId}`)

let config
let current = 1n + BigInt(workerId)
let matches = []

const hash160 = (bytes) => {
  const sha = sha256(Uint8Array.from(bytes)).slice()
  return ripemd160(sha)
}

const toBase58Check = (payload, version) => {
  const versioned = new Uint8Array([version, ...payload])
  const checksum = sha256(sha256(versioned)).slice(0, 4)
  const full = new Uint8Array([...versioned, ...checksum])
  return bs58.encode(full)
}

const toBech32Address = (hash) => {
  const words = bech32.toWords(hash)
  words.unshift(0x00) // witness version 0
  return bech32.encode('bc', words)
}

const toP2SH_P2WPKH = (hash) => {
  const redeemScript = new Uint8Array([0x00, 0x14, ...hash])
  const redeemHash = hash160(redeemScript)
  return toBase58Check(redeemHash, 0x05)
}

const loadConfig = async () => {
  const raw = await fs.readFile(CONFIG_FILE, 'utf-8')
  config = JSON.parse(raw)
  config.publicKeysList = new Set((config.publicKeysList || []).map(k => k.toLowerCase()))
  config.legacyAddressesList = new Set(config.legacyAddressesList || [])
  config.segWitAddressesList = new Set(config.segWitAddressesList || [])
  config.p2shSegWitAddressesList = new Set(config.p2shSegWitAddressesList || [])
}

const loadProgress = async () => {
  try {
    const data = await fs.readFile(SAVE_FILE, 'utf-8')
    const saved = JSON.parse(data)
    current = BigInt(saved.lastTried || current)
  } catch {
    console.error('⚠️ Failed to load progress, starting from scratch.')
  }

  try {
    const data = await fs.readFile(MATCHES_FILE, 'utf-8')
    matches = JSON.parse(data)
  } catch {
    matches = []
  }
}

const saveProgress = async () => {
  await fs.writeFile(SAVE_FILE, JSON.stringify({ lastTried: current.toString() }, null, 2))
  await fs.writeFile(MATCHES_FILE, JSON.stringify(matches, null, 2))
}

const checkKey = (privKey) => {
  const privHex = privKey.toString(16).padStart(64, '0')
  const pub = ec.keyFromPrivate(privHex, 'hex').getPublic()
  const pubUncompressed = pub.encode('hex').toLowerCase()
  const pubCompressed = pub.encodeCompressed('hex')
  const pubBytes = Buffer.from(pubCompressed, 'hex')
  const hash = hash160(pubBytes)

  const legacy = toBase58Check(hash, 0x00)
  const segwit = toBech32Address(hash)
  const p2shSegwit = toP2SH_P2WPKH(hash)

  if (config.publicKeysList.has(pubUncompressed)) return { type: 'pubKey', value: pubUncompressed }
  if (config.legacyAddressesList.has(legacy)) return { type: 'legacy', value: legacy }
  if (config.segWitAddressesList.has(segwit)) return { type: 'segwit', value: segwit }
  if (config.p2shSegWitAddressesList.has(p2shSegwit)) return { type: 'p2sh-segwit', value: p2shSegwit }

  return null
}

const run = async () => {
  await loadConfig()
  await loadProgress()

  let loopCount = 0n
  const step = BigInt(totalWorkers)

  setInterval(() => {
    saveProgress().catch(() => {})
    parentPort.postMessage({ type: 'status', workerId, count: loopCount, lastTriedKey: current.toString(16).padStart(64, '0') })
  }, 10_000)

  while (true) {
    const match = checkKey(current)
    if (match) {
      const matchData = {
        privateKey: current.toString(16).padStart(64, '0'),
        matchType: match.type,
        matchValue: match.value,
        timestamp: new Date().toISOString(),
      }

      matches.push(matchData)
      await fs.writeFile(`${MATCH_PREFIX}-${current}.json`, JSON.stringify(matchData, null, 2))
      parentPort.postMessage({ type: 'match', workerId, privateKey: matchData.privateKey })
    }

    current += step
    loopCount++

    if (loopCount % 10000n === 0n) {
      await new Promise(resolve => setImmediate(resolve))
    }
  }
}

run()
