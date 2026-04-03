import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { performance } from 'perf_hooks';
import { zlibSync, unzlibSync } from 'fflate';
import { chacha20poly1305 } from '@noble/ciphers/chacha.js';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Convert to ES module directory equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
if (!PINATA_JWT) {
  console.error("❌ REACT_APP_PINATA_JWT not found in frontend/.env");
  process.exit(1);
}

const PDF_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const SAMPLE_PDF_PATH = path.join(__dirname, 'sample-cert.pdf');

// IPFS Gateways to benchmark
const GATEWAYS = [
  { name: 'Pinata Gateway', url: 'https://gateway.pinata.cloud/ipfs/' },
  { name: 'Cloudflare IPFS', url: 'https://cloudflare-ipfs.com/ipfs/' },
  { name: 'IPFS.io Public', url: 'https://ipfs.io/ipfs/' },
  { name: 'Dweb.link', url: 'https://dweb.link/ipfs/' }
];

async function ensureSamplePDF() {
  if (!fs.existsSync(SAMPLE_PDF_PATH)) {
    console.log(`📥 Downloading sample PDF to simulate real document...`);
    const res = await axios.get(PDF_URL, { responseType: 'arraybuffer' });
    fs.writeFileSync(SAMPLE_PDF_PATH, res.data);
    console.log(`✅ Downloaded sample-cert.pdf (${(res.data.byteLength / 1024).toFixed(2)} KB)`);
  }
}

async function runBenchmark() {
  await ensureSamplePDF();

  const rawBytes = fs.readFileSync(SAMPLE_PDF_PATH);
  const rawSizeKB = (rawBytes.length / 1024).toFixed(2);
  
  console.log(`\n========================================`);
  console.log(`   BlockCert Security & Storage Benchmark   `);
  console.log(`========================================`);
  console.log(`📄 File: Sample PDF (${rawSizeKB} KB)`);

  const metrics = {};

  // 1. ZLib Compression
  const startZlib = performance.now();
  const compressed = zlibSync(rawBytes);
  const endZlib = performance.now();
  metrics['🔹 ZLib Compression Time'] = `${(endZlib - startZlib).toFixed(2)} ms`;
  metrics['🔹 Compressed Size'] = `${(compressed.length / 1024).toFixed(2)} KB`;
  metrics['🔹 Size Reduction'] = `${(((1 - compressed.length / rawBytes.length)) * 100).toFixed(2)}%`;

  // 2. ChaCha20-Poly1305 Encryption
  const key = ethers.utils.randomBytes(32);
  const nonce = ethers.utils.randomBytes(12);
  
  const startEncrypt = performance.now();
  const chacha = chacha20poly1305(key, nonce);
  const ciphertext = chacha.encrypt(compressed);
  const endEncrypt = performance.now();
  
  // Package for BCV2
  const magicMarker = new Uint8Array([66, 67, 86, 50]); // BCV2
  const finalPayload = new Uint8Array(magicMarker.length + nonce.length + ciphertext.length);
  finalPayload.set(magicMarker, 0);
  finalPayload.set(nonce, magicMarker.length);
  finalPayload.set(ciphertext, magicMarker.length + nonce.length);
  
  metrics['🔒 ChaCha20-Poly1305 Encryption Time'] = `${(endEncrypt - startEncrypt).toFixed(2)} ms`;
  metrics['🔒 Final Encrypted Vault Size'] = `${(finalPayload.length / 1024).toFixed(2)} KB`;

  // 3. Pinata IPFS Upload
  console.log(`\n⏳ Pushing Vault to Decentralized IPFS Network via Pinata...`);
  const formData = new FormData();
  formData.append('file', new Blob([finalPayload]), 'sample-cert.encrypted');
  
  const startUpload = performance.now();
  const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    headers: { 
      'Authorization': `Bearer ${PINATA_JWT}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  const endUpload = performance.now();
  const CID = res.data.IpfsHash;

  metrics['☁️  Pinata IPFS Pinning Time'] = `${(endUpload - startUpload).toFixed(2)} ms`;
  metrics['☁️  Generated CID'] = CID;

  console.log(`✅ Upload Complete! Testing Verification Latency...\n`);
  
  // Wait a moment for network propagation to IPFS peers before fetching
  console.log(`[Waiting 5 seconds for basic IPFS DHT propagation...]`);
  await new Promise(r => setTimeout(r, 5000));

  // 4. Gateway Retrieval Racing
  const gatewayResults = [];
  
  for (const gw of GATEWAYS) {
    console.log(`   Fetching via ${gw.name}...`);
    const startFetch = performance.now();
    try {
      const fetchReq = await axios.get(`${gw.url}${CID}`, { 
        responseType: 'arraybuffer',
        timeout: 10000 // 10s timeout
      });
      const endFetch = performance.now();
      
      const payloadReceived = new Uint8Array(fetchReq.data);
      
      gatewayResults.push({
        Gateway: gw.name,
        'Latency (ms)': (endFetch - startFetch).toFixed(2),
        Status: payloadReceived.length === finalPayload.length ? '✅ Integrity OK' : '❌ Corrupted'
      });
    } catch (err) {
      gatewayResults.push({
        Gateway: gw.name,
        'Latency (ms)': 'Timeout/Error',
        Status: '❌ Failed'
      });
    }
  }

  // 5. Decryption & Decompression
  const startDecrypt = performance.now();
  const extractNonce = finalPayload.slice(4, 16);
  const extractCiphertext = finalPayload.slice(16);
  const reverseChacha = chacha20poly1305(key, extractNonce);
  const rawCompressed = reverseChacha.decrypt(extractCiphertext);
  const endDecrypt = performance.now();
  
  const startUnzlib = performance.now();
  unzlibSync(rawCompressed);
  const endUnzlib = performance.now();

  metrics['🔓 ChaCha20 Decryption Time'] = `${(endDecrypt - startDecrypt).toFixed(2)} ms`;
  metrics['🔓 ZLib Decompression Time'] = `${(endUnzlib - startUnzlib).toFixed(2)} ms`;

  console.log(`\n========================================`);
  console.log(`          BENCHMARK RESULTS             `);
  console.log(`========================================`);
  for (const [k, v] of Object.entries(metrics)) {
    console.log(`${k.padEnd(38)} : ${v}`);
  }
  
  console.log(`\n=== 🌍 PUBLIC GATEWAY COMPARISON (CID Retrieval) ===`);
  console.table(gatewayResults);
  console.log(`========================================\n`);
}

runBenchmark().catch(err => {
  console.error(err);
});
