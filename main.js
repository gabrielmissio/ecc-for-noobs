import { ec as EC } from 'elliptic';
import { Wallet, keccak256, getBytes, sha256 } from 'ethers';
import { ripemd160 } from '@noble/hashes/ripemd160';
import bs58 from 'bs58';

// Setup elliptic curve
const ec = new EC('secp256k1');

// DOM elements
const privateKeyInput = document.getElementById('privateKeyInput');
const generateBtn = document.getElementById('generateBtn');

const privateKeyField = document.getElementById('privateKey');
const publicKeyField = document.getElementById('publicKey');
const publicKeyXField = document.getElementById('publicKeyX');
const publicKeyYField = document.getElementById('publicKeyY');
const ethAddressField = document.getElementById('ethAddress');
const btcLegacyField = document.getElementById('btcLegacy');
const btcSegwitField = document.getElementById('btcSegwit');

generateBtn.addEventListener('click', generateAddress);

function isValidPrivateKey(hex) {
  return /^[0-9a-fA-F]{64}$/.test(hex);
}

function generateAddress() {
  const privKeyHex = privateKeyInput.value.trim();
  if (!isValidPrivateKey(privKeyHex)) {
    alert('Invalid private key! Enter exactly 64 hex chars.');
    return;
  }

  //
  // === STEP 1: Elliptic Public Key ===
  //
  const keyPair = ec.keyFromPrivate(privKeyHex, 'hex');
  const pubPoint = keyPair.getPublic();
  const pubX = pubPoint.getX().toString('hex').padStart(64, '0');
  const pubY = pubPoint.getY().toString('hex').padStart(64, '0');
  const uncompressedPubKey = '0x04' + pubX + pubY;

  //
  // === STEP 2: Ethereum Address ===
  //
  const rawBytes = getBytes('0x' + pubX + pubY); // X+Y only, no 0x04
  const hash = keccak256(rawBytes);
  const ethAddress = '0x' + hash.slice(-40);

  //
  // === STEP 3: Bitcoin Legacy + SegWit ===
  //
  const compressedPubKey = getCompressedPubKey(pubPoint);
  const pubkeyBytes = hexToBytes(compressedPubKey);

  const pubkeyHash = hash160(pubkeyBytes); // HASH160(pubkey)
  const btcLegacy = toBase58Check(pubkeyHash, 0x00); // P2PKH

  // P2SH-P2WPKH (3...)
  const segwitScript = new Uint8Array([0x00, 0x14, ...pubkeyHash]);
  const redeemHash = hash160(segwitScript);
  const btcSegwit = toBase58Check(redeemHash, 0x05);

  //
  // === STEP 4: Ethers.js Verification ===
  //
  const ethersWallet = new Wallet(privKeyHex);
  const ethersPubKey = ethersWallet.signingKey.publicKey;
  const ethersAddress = ethersWallet.address;

  //
  // === Output to UI ===
  //
  privateKeyField.textContent = privKeyHex;
  publicKeyField.textContent = uncompressedPubKey;
  publicKeyXField.textContent = pubX;
  publicKeyYField.textContent = pubY;
  ethAddressField.textContent = ethAddress;
  btcLegacyField.textContent = btcLegacy;
  btcSegwitField.textContent = btcSegwit;

  //
  // === Console Dev Logs ===
  //
  console.log('Private Key:', privKeyHex);
  console.log('Public Key X:', pubX);
  console.log('Public Key Y:', pubY);
  console.log('Uncompressed Public Key:', uncompressedPubKey);
  console.log('Compressed Public Key:', compressedPubKey);
  console.log('Ethereum Address:', ethAddress);
  console.log('BTC Legacy:', btcLegacy);
  console.log('BTC SegWit:', btcSegwit);
  console.log('Ethers.js Public Key:', ethersPubKey);
  console.log('Ethers.js Address:', ethersAddress);

  //
  // === Consistency Validation ===
  //
  if (ethersAddress.toLowerCase() === ethAddress.toLowerCase()) {
    console.log('%c✔ Ethereum address matches', 'color: green');
  } else {
    console.error('❌ Ethereum address mismatch');
  }

  if (ethersPubKey.toLowerCase() === uncompressedPubKey.toLowerCase()) {
    console.log('%c✔ Public key matches', 'color: green');
  } else {
    console.error('❌ Public key mismatch');
  }
}

//
// === Helpers ===
//

function hexToBytes(hex) {
  hex = hex.replace(/^0x/, '');
  return Uint8Array.from(hex.match(/.{2}/g).map(b => parseInt(b, 16)));
}

function hash160(bytes) {
  const hash = sha256(bytes).slice(2); // remove 0x
  const shaBytes = hexToBytes(hash);
  return ripemd160(shaBytes); // returns Uint8Array(20)
}

function toBase58Check(payload, version) {
  const versioned = new Uint8Array([version, ...payload]);
  const hash1 = sha256(versioned).slice(2);
  const hash2 = sha256(hexToBytes(hash1)).slice(2);
  const checksum = hexToBytes(hash2.slice(0, 8));
  const fullPayload = new Uint8Array([...versioned, ...checksum]);
  return bs58.encode(fullPayload);
}

function getCompressedPubKey(pubPoint) {
  const x = pubPoint.getX().toString('hex').padStart(64, '0');
  const y = BigInt('0x' + pubPoint.getY().toString('hex'));
  const prefix = y % 2n === 0n ? '02' : '03';
  return prefix + x;
}
