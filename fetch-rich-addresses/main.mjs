import fs from 'fs/promises';

const REPORT_PATH = './rich-addresses-report.json';
const MIN_BALANCE = 0.5; // minimum BTC balance to include
const MAX_ADDRESSES = 1000; // max addresses to collect
const BLOCKSTREAM_API = 'https://blockstream.info/api';

const delay = ms => new Promise(res => setTimeout(res, ms));

const getRichEntities = async () => {
  const legacy = new Set();
  const segwit = new Set();
  const p2sh = new Set();
  const publicKeys = new Set();
  const seenAddresses = new Set();
  const addressQueue = [];

  // Start from recent blocks
  const blocksRes = await fetch(`${BLOCKSTREAM_API}/blocks`);
  const blocks = await blocksRes.json();
  if (!Array.isArray(blocks)) return { legacyAddressesList: [], p2shSegWitAddressesList: [], segWitAddressesList: [], publicKeysList: [] };

  for (const block of blocks) {
    const txsRes = await fetch(`${BLOCKSTREAM_API}/block/${block.id}/txs`);
    const txs = await txsRes.json();

    for (const tx of txs) {
      for (const vout of tx.vout) {
        const { scriptpubkey_address: address } = vout;
        if (address && !seenAddresses.has(address)) {
          seenAddresses.add(address);
          addressQueue.push(address);
        }
        if (addressQueue.length >= MAX_ADDRESSES * 10) break;
      }
      if (addressQueue.length >= MAX_ADDRESSES * 10) break;
    }
    if (addressQueue.length >= MAX_ADDRESSES * 10) break;
    await delay(1000);
  }

  // Now fetch balances for collected addresses
  for (const address of addressQueue) {
    try {
      const res = await fetch(`${BLOCKSTREAM_API}/address/${address}`);
      const data = await res.json();
      const balance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
      const unspent = data.chain_stats.tx_count > 0 && balance > 0;
      if (unspent && balance >= MIN_BALANCE * 1e8) {
        if (address.startsWith('1')) legacy.add(address);
        else if (address.startsWith('3')) p2sh.add(address);
        else if (address.startsWith('bc1q')) segwit.add(address);
      }
    } catch (err) {
      console.error(`⚠️ Failed to fetch data for address ${address}`);
    }
    if (legacy.size + segwit.size + p2sh.size >= MAX_ADDRESSES) break;
    await delay(250);
  }

  return {
    legacyAddressesList: [...legacy],
    p2shSegWitAddressesList: [...p2sh],
    segWitAddressesList: [...segwit],
    publicKeysList: [...publicKeys] // publicKeys currently empty, retained for future
  };
};


const saveReport = async (entities) => {
  const report = {
    generatedAt: new Date().toISOString(),
    ...entities
  };

  await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`📝 Saved rich-addresses-report.json with ${report.publicKeysList.length} public keys and ${report.legacyAddressesList.length + report.segWitAddressesList.length + report.p2shSegWitAddressesList.length} addresses.`);
};

const main = async () => {
  console.log(`🔍 Fetching rich BTC entities (≥ ${MIN_BALANCE} BTC UTXO balance)...`);
  const entities = await getRichEntities();
  await saveReport(entities);
};

main().catch(err => {
  console.error('❌ Failed to fetch addresses:', err);
});
