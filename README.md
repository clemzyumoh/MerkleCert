MerkleCert
MerkleCert is a decentralized certificate issuance and verification system that leverages Merkle trees and the Solana blockchain to ensure tamper-proof, verifiable academic or professional certificates.

Overview
MerkleCert allows organizations to issue digital certificates and prove their validity cryptographically. Certificates are grouped into Merkle trees, and their roots are published on-chain. Users can independently verify certificate authenticity using the certificate's Merkle proof and associated Solana transaction.

 Purpose
Traditional digital certificates can be easily faked or modified. MerkleCert addresses this by:

Allowing issuers to cryptographically verify the inclusion of a certificate in an issuance batch.

Publishing a Merkle root on Solana, creating an immutable record of all issued certificates.

Enabling gasless, off-chain Merkle proof verification by any third party.

Ensuring privacy by not exposing individual certificate data on-chain.


 Architecture
1. Certificate Issuance Flow
Certificates are generated with metadata (e.g., name, issuer, date).

A Merkle tree is created from hashed certificate data.

The Merkle root is published on Solana using a Memo transaction.

Certificate metadata is uploaded to IPFS.

The backend stores:

Certificate details (certId, metadata)

IPFS hash

Merkle proof

Merkle root

Solana transaction signature


2. Verification Flow
The certificate viewer pulls data from backend storage.

It displays:

IPFS-embedded certificate (via iframe)

Certificate metadata

Shortened Merkle root and Solana Tx hash (with copy buttons)

The Merkle proof is validated by reconstructing the Merkle root.

The root is checked against the one stored on-chain in the Memo instruction.


 Role-Based Access Control
Roles:
Issuer: Authorized wallet that can create Merkle batches and issue certificates.

Verifier: Any user who wants to validate a certificate.

Viewer: Anyone with a certificate URL can view its authenticity.

Wallet Permissions:
Wallets are connected via @solana/web3.js.

Only whitelisted wallets (stored server-side or in a config) can issue certificates.

Issuer wallets sign the Solana transaction that anchors the Merkle root.


Why Merkle Trees?
Merkle trees allow us to:

Group multiple certificates under a single on-chain hash (Merkle root).

Generate compact Merkle proofs (~1 KB) per certificate.

Enable gasless verification: Anyone can verify inclusion using only a Merkle proof and root.

Scale: One transaction can prove thousands of certificates.


Why Solana?
We chose Solana because:

Fast & low cost: Transactions are cheap and near-instant.

Memo Program support: Allows embedding arbitrary UTF-8 data (Merkle root).

Public ledger: Immutable, decentralized root anchoring.

The Merkle root is included in a transaction using the MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr Memo program.


 Tech Stack
Component---	Tech
Frontend	---React, TailwindCSS
Wallet Connection---	@solana/wallet-adapter
Backend---	Node.js, Express
Blockchain	---Solana (Devnet)
File Storage	---IPFS via NFT.Storage
Hashing	---keccak256 (via ethers.js)
Merkle Tree	---merkletreejs
Database	--MongoDB

LInk To Video
https://www.loom.com/share/623661d8a7b0464fb6d3b98a0ac27df9?sid=8e2ecc16-591b-4406-b416-c01fa78bb9c1


Test Wallet
Use the following Phantom solana wallets to test the app on Solana Devnet:

Seed Phrase (for import):
 seed phrase :  asthma   quote   build   hamster  news  exhibit  globe book tribe kick final  only 

Wallet Address:

Account 1: 3QgM7kx3mAfDkCEBeyADR16V7nhUwvZoPnRpZyb61yhE  (admin)

Account 2: 8WMBtjhyEnmdHrbudohgniLk8UPDaw1jqVZW8NrdkPFt    (user)

You can import this seed phrase into Phantom and switch between accounts to test different roles (e.g., admin and user).


Instructions:

Open Phantom → Settings → Secret Recovery Phrase → Paste it.

Use "Add Account" to access both accounts.

Deployed Link:
https://merkle-cert.vercel.app/
