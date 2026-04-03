# 🎓 BlockCert: Decentralized Academic Credential Registry

An end-to-end blockchain platform built to permanently eliminate academic credential forgery. BlockCert allows educational institutions to securely issue, encrypt, and anchor student credentials on the Ethereum blockchain and IPFS, providing employers with a one-tap verification pipeline.

## ✨ Core Features & Novelty

- **Zero-Knowledge Cryptographic Middleware**: Student credentials are encrypted client-side using a high-performance **ChaCha20-Poly1305 AEAD** scheme paired with **ZLib compression**. The raw data uploaded to IPFS is entirely unreadable without the specific decryption fragment.
- **Institutional Registry Vault (EIP-191)**: Employs a deterministic signature derivation model. The "Institution" (Issuer) natively derives decryption shards using their wallet signature, avoiding centralized key-storage vulnerabilities and remaining fully sovereign.
- **Deep-Linked QR Verification**: Issues a dynamic "Universal Verification Token" (QR code). A single scan by a recruiter’s mobile device executes the decryption matrix and verifies the authenticity of the degree computationally in under 1 second.
- **Web3 RBAC**: Strict Role-Based Access Control enforcing permissions directly on the Smart Contract (e.g., Government, Regulatory Authority, Institution, Student, Recruiter).

## 🛠 Tech Stack

- **Smart Contracts (Backend)**: Solidity, Hardhat, Ethers.js
- **Frontend/Middleware**: React.js, Material-UI (MUI), Vercel CI/CD
- **Decentralized Storage**: InterPlanetary File System (IPFS) via Pinata
- **Cryptography**: `@noble/ciphers` (ChaCha20-Poly1305), `fflate`

---

## 🚦 Prerequisites

Ensure you have the following installed:
- Node.js 22 (see `.nvmrc`)
- npm
- MetaMask (or another injected Web3 wallet) for testing

```bash
nvm use
```

## 📦 Installation

Install both the Hardhat root dependencies and the React frontend dependencies:

```bash
# 1. Install root dependencies (Smart Contracts & Hardhat)
npm install

# 2. Install React frontend dependencies
npm --prefix frontend install
```

## 💻 Local Development Workflow

To run the full stack locally, you need to run both the local blockchain node and the React server.

**Terminal 1: Start the Hardhat Node & Deploy**
```bash
# Start the local blockchain
npx hardhat node

# In a separate terminal or using Hardhat's deploy script, deploy the contracts
npx hardhat run scripts/deploy.js --network localhost
```
*(Copy the deployed contract address and update it in `frontend/src/config/contracts.js` if necessary).*

**Terminal 2: Start the Frontend**
```bash
# Start the React development server
npm --prefix frontend start
```

## 🧪 Testing

The repository maintains strict test coverage for both the core Solidity logic and the frontend CI pipeline.

```bash
# Run Smart Contract tests
npm run test:contracts

# Run Frontend tests (CI Mode)
npm run test:frontend

# Run all tests sequentially
npm run test:all
```

## 🚀 Production Deployment (Vercel Ready)

This platform is configured for strict edge-deployment via Vercel. Standard React lint warnings (e.g., unused variables or missing `useEffect` dependencies) are actively configured to trigger build failures to maintain pristine production code.

**Build Locally:**
```bash
npm run build:frontend
```

**Serve Local Production Build:**
```bash
npm run serve:frontend
```

*Deployment Notes:*
- The production CRA build is output to `frontend/build`.
- The application utilizes `process.env.REACT_APP_PINATA_JWT` for the IPFS integration. Ensure this environment variable is configured in your Vercel/production environment.

## 📋 Manual QA Checklist

- [ ] Connect a Web3 Wallet from the dark-themed dashboard.
- [ ] Verify the wallet address reflects accurate Administrator/Institutional rights (`ManageRoles.js`).
- [ ] Issue a new test credential via the Issuance Portal, attaching a PDF/Image.
- [ ] Ensure the payload propagates to IPFS and returns a valid `certId` and decryption string.
- [ ] Navigate to the Verification page or scan the generated Branded QR code.
- [ ] Confirm that verification turns "Green" and dynamically decrypts the payload for download.

---
*Built as a research initiative at the intersection of Cryptography, Web3, and Educational Security.*
