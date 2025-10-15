import { Transaction } from "../rsc/core/transaction.js";
import { createWallet } from "../rsc/core/wallet.js";

console.log("🚀 Test transaksi dimulai...\n");

const sender = createWallet();
const receiver = createWallet();

const tx = new Transaction(sender.address, receiver.address, 50);
tx.signTransaction(sender.privateKey);

console.log("🔏 Signature:", tx.signature);
console.log("✅ Validasi transaksi:", tx.isValid());
