// src/test_wallet.js
import { createWallet, loadWalletFromMnemonic } from "./core/wallet.js";

// 🔹 Buat wallet baru
const wallet = createWallet();

// 🔹 Pulihkan wallet dari mnemonic
const restored = loadWalletFromMnemonic(wallet.mnemonic);

console.log("\nPerbandingan hasil:");
console.log("Address baru     :", wallet.address);
console.log("Address restore  :", restored.address);
