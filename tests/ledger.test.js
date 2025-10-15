import { Blockchain } from "../src/core/chain.v2.js";
import { Transaction } from "../src/core/transaction.js";
import { createWallet } from "../src/core/wallet.js";

console.log("🚀 Starting Genesis Ledger v2...\n");

const miner = createWallet();
const alice = createWallet();
const bob = createWallet();

const ledger = new Blockchain();

// Alice kirim 25 ke Bob
const tx1 = new Transaction(alice.address, bob.address, 25);
tx1.signTransaction(alice.privateKey);
ledger.addTransaction(tx1);

// Mulai mining oleh miner
ledger.minePendingTransactions(miner.address);

// Cek saldo setelah mining
console.log("\n💰 Balances:");
console.log("Miner:", ledger.getBalanceOfAddress(miner.address));
console.log("Alice:", ledger.getBalanceOfAddress(alice.address));
console.log("Bob  :", ledger.getBalanceOfAddress(bob.address));

console.log("\nChain valid?", ledger.isChainValid());
