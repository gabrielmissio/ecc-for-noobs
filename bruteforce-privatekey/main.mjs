import fs from 'fs/promises';
import path from 'path';
import elliptic from 'elliptic';

const { ec: EC } = elliptic;
const ec = new EC('secp256k1');

const SAVE_FILE = './progress.json';
const MATCHES_FILE = './matches.json';
const INTERVAL_MS = 1 * 60 * 1000; // Save every 1 min

let current = 1n;
let knownPublicKeys = new Set();
let matches = [];

const loadKnownKeys = async () => {
  try {
    const data = await fs.readFile('./knownPublicKeys.json', 'utf-8');
    const list = JSON.parse(data);
    knownPublicKeys = new Set(list.map(k => k.toLowerCase()));
  } catch (err) {
    console.error('Error loading knownPublicKeys.json:', err);
    process.exit(1);
  }
};

const loadProgress = async () => {
  try {
    const file = await fs.readFile(SAVE_FILE, 'utf-8');
    const saved = JSON.parse(file);
    current = BigInt(saved.lastTried || 1);
    console.log(`✅ Resuming from private key: ${current}`);
  } catch {
    console.log('🆕 Starting from scratch (private key = 1)');
  }

  try {
    const matchData = await fs.readFile(MATCHES_FILE, 'utf-8');
    matches = JSON.parse(matchData);
  } catch {
    matches = [];
  }
};

const saveProgress = async () => {
  console.log(`🕒 Attempting to save at ${new Date().toISOString()}`); // DEBUG LOG
  try {
    await fs.writeFile(SAVE_FILE, JSON.stringify({ lastTried: current.toString() }, null, 2));
    await fs.writeFile(MATCHES_FILE, JSON.stringify(matches, null, 2));
    console.log(`💾 Progress saved at private key: ${current}, total matches: ${matches.length}`);
  } catch (err) {
    console.error('❌ Failed to save progress:', err);
  }
};

const checkKey = (privKey) => {
  const privHex = privKey.toString(16).padStart(64, '0');
  const pub = ec.keyFromPrivate(privHex, 'hex').getPublic();
  const pubHex = pub.encode('hex').toLowerCase(); // uncompressed
  return knownPublicKeys.has(pubHex) ? pubHex : null;
};

const main = async () => {
  await loadKnownKeys();
  await loadProgress();

  console.log('🚀 Brute force started...\n');

  let loopCount = 0;

  while (true) {
    const matchedPub = checkKey(current);
    if (matchedPub) {
      const match = {
        privateKey: current.toString(16).padStart(64, '0'),
        publicKey: matchedPub,
        timestamp: new Date().toISOString()
      };

      console.log(`🎯 Match found!`);
      console.log(`   Private Key: ${match.privateKey}`);
      console.log(`   Public Key : ${match.publicKey}`);

      matches.push(match);
      await fs.writeFile(`match-${current.toString()}.json`, JSON.stringify(match, null, 2));
    }

    if (current % 100000n === 0n) {
      console.log(`🔁 Tried ${current} private keys so far...`);
    }

    current++;
    loopCount++;

    // Yield control to allow setInterval() and other tasks to run
    if (loopCount % 1000 === 0) {
      await new Promise(resolve => setImmediate(resolve)); // micro task break
    }
  }
};

setInterval(() => {
  saveProgress().catch((err) => {
    console.error('❌ Failed to save progress (interval):', err);
  });
}, INTERVAL_MS);

main();
