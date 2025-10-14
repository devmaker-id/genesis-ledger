import { Block } from "./block.js";

/**
 * Blockchain Class
 * Rangkaian block yang saling terhubung
 */
export class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3; // kamu bisa naikkan untuk mining lebih lama
  }

  createGenesisBlock() {
    return new Block(0, "0", Date.now(), { msg: "Genesis Block" });
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
      if (currentBlock.previousHash !== prevBlock.hash) return false;
    }
    return true;
  }
}

// Demo: menjalankan blockchain dan menambang block pertama
const ledger = new Blockchain();

console.log("🚀 Creating the Genesis Ledger...");
ledger.addBlock(new Block(1, "", Date.now(), { amount: 42 }));

console.log(JSON.stringify(ledger, null, 2));
console.log("✅ Chain valid?", ledger.isChainValid());
