import crypto from "crypto";

/**
 * Block Class
 * Representasi unit dasar blockchain
 */
export class Block {
  constructor(index, previousHash, timestamp, data, nonce = 0) {
    this.index = index;               // urutan block
    this.previousHash = previousHash; // hash block sebelumnya
    this.timestamp = timestamp;       // waktu pembuatan
    this.data = data;                 // data transaksi / payload
    this.nonce = nonce;               // untuk proof-of-work
    this.hash = this.calculateHash(); // hash block saat ini
  }

  calculateHash() {
    const content =
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.data) +
      this.nonce;
    return crypto.createHash("sha256").update(content).digest("hex");
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join("0");
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`✅ Block mined: ${this.hash}`);
  }

  hasValidTransactions() {
    // Jika block tidak memuat array transaksi (contohnya genesis block)
    if (!Array.isArray(this.data)) return true;

    for (const tx of this.data) {
      // transaksi null atau bukan object Transaction → lewati
      if (!tx || typeof tx.isValid !== "function") continue;

      if (!tx.isValid()) {
        console.log("❌ Invalid transaction detected in block!");
        return false;
      }
    }

    return true;
  }
}
