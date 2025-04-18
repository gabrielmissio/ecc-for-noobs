import { ec as EC } from 'elliptic';
import { Wallet, keccak256, getBytes } from 'ethers';

const ec = new EC('secp256k1');

const privateKeyInput = document.getElementById('privateKeyInput');
const generateBtn = document.getElementById('generateBtn');

const privateKeyField = document.getElementById('privateKey');
const publicKeyField = document.getElementById('publicKey');
const publicKeyXField = document.getElementById('publicKeyX');
const publicKeyYField = document.getElementById('publicKeyY');
const ethAddressField = document.getElementById('ethAddress');

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
  // === STEP 1: Derive Public Key using elliptic ===
  //
  const keyPair = ec.keyFromPrivate(privKeyHex, 'hex');
  const pubPoint = keyPair.getPublic();

  const pubX = pubPoint.getX().toString('hex').padStart(64, '0');
  const pubY = pubPoint.getY().toString('hex').padStart(64, '0');
  const uncompressedPubKey = '0x04' + pubX + pubY;

  //
  // === STEP 2: Derive Ethereum Address (Keccak-256 of X+Y)
  //
  const rawBytes = getBytes('0x' + pubX + pubY);
  const hash = keccak256(rawBytes);
  const manualAddress = '0x' + hash.slice(-40);

  //
  // === STEP 3: Verify using ethers.js
  //
  const ethersWallet = new Wallet(privKeyHex);
  const ethersPubKey = ethersWallet.signingKey.publicKey;
  const ethersAddress = ethersWallet.address;

  //
  // === Output to Console (for dev)
  //
  console.log('Private Key:', privKeyHex);
  console.log('Elliptic Pub (x):', pubX);
  console.log('Elliptic Pub (y):', pubY);
  console.log('Elliptic Pub (full):', uncompressedPubKey);
  console.log('Ethers.js Pub:', ethersPubKey);
  console.log('Manual Address:', manualAddress);
  console.log('Ethers Address:', ethersAddress);

  //
  // === Update HTML Output ===
  //
  privateKeyField.textContent = privKeyHex;
  publicKeyField.textContent = uncompressedPubKey;
  publicKeyXField.textContent = pubX;
  publicKeyYField.textContent = pubY;
  ethAddressField.textContent = manualAddress;

  //
  // === Validation
  //
  if (ethersAddress.toLowerCase() === manualAddress.toLowerCase()) {
    console.log('%c✔ Address match!', 'color: green');
  } else {
    console.error('❌ Address mismatch!');
  }

  if (ethersPubKey.toLowerCase() === uncompressedPubKey.toLowerCase()) {
    console.log('%c✔ Public key match!', 'color: green');
  } else {
    console.error('❌ Public key mismatch!');
  }
}
