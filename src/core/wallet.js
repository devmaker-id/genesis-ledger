// src/core/wallet.js
import * as bip39 from "bip39";
import pkg from "elliptic";
const { ec: EC } = pkg;
import crypto from "crypto";
import fs from "fs";
import path from "path";

const ec = new EC("secp256k1");
const WALLET_DIR = path.resolve("wallets");

if (!fs.existsSync(WALLET_DIR)) {
  fs.mkdirSync(WALLET_DIR);
}

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest();
}

function ripemd160(data) {
  return crypto.createHash("ripemd160").update(data).digest("hex");
}

export function createWallet() {
  const mnemonic = bip39.generateMnemonic(128);
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  const privateKey = sha256(seed).toString("hex");
  const keyPair = ec.keyFromPrivate(privateKey);
  const publicKey = keyPair.getPublic("hex");

  const address = ripemd160(sha256(Buffer.from(publicKey, "hex")));

  const wallet = {
    address,
    publicKey,
    privateKey,
    mnemonic,
    createdAt: new Date().toISOString(),
  };

  const filePath = path.join(WALLET_DIR, `${address}.wallet.json`);
  fs.writeFileSync(filePath, JSON.stringify(wallet, null, 2));

  console.log("✅ Wallet berhasil dibuat:");
  console.log(`📜 Address : ${address}`);
  console.log(`🔐 File    : ${filePath}`);

  return wallet;
}

export function loadWalletFromMnemonic(mnemonic) {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Mnemonic tidak valid!");
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const privateKey = sha256(seed).toString("hex");
  const keyPair = ec.keyFromPrivate(privateKey);
  const publicKey = keyPair.getPublic("hex");
  const address = ripemd160(sha256(Buffer.from(publicKey, "hex")));

  const wallet = {
    address,
    publicKey,
    privateKey,
    mnemonic,
    restoredAt: new Date().toISOString(),
  };

  console.log("🔁 Wallet berhasil dipulihkan:");
  console.log(`📜 Address : ${address}`);

  return wallet;
}
