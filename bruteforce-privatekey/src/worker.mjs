import fs from 'fs/promises';
import { parentPort, workerData } from 'worker_threads';
import elliptic from 'elliptic';

const { ec: EC } = elliptic;
const ec = new EC('secp256k1');

const { workerId, totalWorkers } = workerData;
const SAVE_FILE = `./progress-worker-${workerId}.json`;
const MATCHES_FILE = `./matches-worker-${workerId}.json`;
const MATCH_PREFIX = `match-${workerId}`;

let knownPublicKeys = new Set();
let current = BigInt(workerId); // start = workerId
let matches = [];

const loadKnownKeys = async () => {
  try {
    const data = await fs.readFile('./knownPublicKeys.json', 'utf-8');
    const list = JSON.parse(data);
    knownPublicKeys = new Set(list.map(k => k.toLowerCase()));
  } catch (err) {
    console.error(`[Worker ${workerId}] Failed to load known keys`, err);
    process.exit(1);
  }
};

const loadProgress = async () => {
  try {
    const data = await fs.readFile(SAVE_FILE, 'utf-8');
    const saved = JSON.parse(data);
    current = BigInt(saved.lastTried || current);
  } catch {
    // no previous progress
  }

  try {
    const data = await fs.readFile(MATCHES_FILE, 'utf-8');
    matches = JSON.parse(data);
  } catch {
    matches = [];
  }
};

const saveProgress = async () => {
  await fs.writeFile(SAVE_FILE, JSON.stringify({ lastTried: current.toString() }, null, 2));
  await fs.writeFile(MATCHES_FILE, JSON.stringify(matches, null, 2));
};

const checkKey = (privKey) => {
  if (privKey <= 0n) {
    return null;
  }

  const privHex = privKey.toString(16).padStart(64, '0');
  const pub = ec.keyFromPrivate(privHex, 'hex').getPublic();
  const pubHex = pub.encode('hex').toLowerCase(); // uncompressed
  return knownPublicKeys.has(pubHex) ? pubHex : null;
};

const run = async () => {
  await loadKnownKeys();
  await loadProgress();

  let loopCount = 0n;
  const step = BigInt(totalWorkers);

  setInterval(() => {
    saveProgress().catch(() => {});
    parentPort.postMessage({ type: 'status', workerId, count: loopCount, lastTriedKey: current.toString(16).padStart(64, '0') });
  }, 10_000); // log every 10s

  while (true) {
    const pubHex = checkKey(current);
    if (pubHex) {
      const match = {
        privateKey: current.toString(16).padStart(64, '0'),
        publicKey: pubHex,
        timestamp: new Date().toISOString()
      };

      matches.push(match);
      await fs.writeFile(`${MATCH_PREFIX}-${current}.json`, JSON.stringify(match, null, 2));
      parentPort.postMessage({ type: 'match', workerId, privateKey: match.privateKey });
    }

    current += step;
    loopCount++;

    if (loopCount % 10_000n === 0n) {
      await new Promise(res => setImmediate(res)); // yield to event loop
    }
  }
};

run();
