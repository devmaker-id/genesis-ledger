// src/core/chain.v2.js
import { Block } from "./block.js";
import { Transaction } from "./transaction.js";

/**
 * Blockchain dengan dukungan transaksi
 */
export class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2; // 3 bisa bikin mining lama di HP
    this.pendingTransactions = [];
    this.miningReward = 50; // reward per blok
  }

  createGenesisBlock() {
    return new Block(0, "0", Date.now(), { msg: "Genesis Block" });
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Tambahkan transaksi baru ke pendingTransactions
   */
  addTransaction(transaction) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaksi harus memiliki fromAddress dan toAddress!");
    }

    if (!transaction.isValid()) {
      throw new Error("Transaksi tidak valid!");
    }

    this.pendingTransactions.push(transaction);
  }

  /**
   * Mining blok baru + memberi reward ke miner
   */
  minePendingTransactions(minerAddress) {
    console.log("🚧 Mining block...");

    const block = new Block(
      this.chain.length,
      this.getLatestBlock().hash,
      Date.now(),
      this.pendingTransactions
    );

    block.mineBlock(this.difficulty);
    console.log("✅ Block mined:", block.hash);

    this.chain.push(block);

    // buat transaksi reward untuk miner
    this.pendingTransactions = [
      new Transaction(null, minerAddress, this.miningReward),
    ];
  }

  /**
   * Hitung saldo wallet berdasarkan seluruh transaksi
   */
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      const data = Array.isArray(block.data) ? block.data : [block.data];
      for (const tx of data) {
        if (!tx) continue;
        if (tx.fromAddress === address) {
          balance -= tx.amount;
        }
        if (tx.toAddress === address) {
          balance += tx.amount;
        }
      }
    }

    return balance;
  }

  /**
   * Validasi seluruh chain dan transaksi
   */
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions?.()) {
        console.error("❌ Invalid transaction in block", i);
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.error("❌ Invalid hash at block", i);
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.error("❌ Broken link between blocks", i);
        return false;
      }
    }

    return true;
  }
}
