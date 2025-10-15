// src/core/transaction.js
import pkg from "elliptic";
const { ec: EC } = pkg;
import crypto from "crypto";

const ec = new EC("secp256k1");

/* -----------------------------------------------------
 * Helper functions
 * ---------------------------------------------------*/
function sha256Buffer(data) {
  return crypto.createHash("sha256").update(data).digest();
}

function sha256Hex(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function ripemd160Hex(data) {
  return crypto.createHash("ripemd160").update(data).digest("hex");
}

/* -----------------------------------------------------
 * Transaction class
 * ---------------------------------------------------*/
export class Transaction {
  constructor(fromAddress, toAddress, amount, senderPublicKey = null) {
    this.fromAddress = fromAddress; // wallet address
    this.toAddress = toAddress;     // wallet address
    this.amount = amount;
    this.timestamp = Date.now();
    this.signature = null;
    this.senderPublicKey = senderPublicKey; // tambahkan public key pengirim
  }

  calculateHash() {
    return sha256Hex(
      this.fromAddress + this.toAddress + this.amount + this.timestamp
    );
  }

  signTransaction(privateKeyHex) {
    const key = ec.keyFromPrivate(privateKeyHex);
    const publicKey = key.getPublic("hex");
    const derivedAddress = ripemd160Hex(sha256Buffer(Buffer.from(publicKey, "hex")));

    if (this.fromAddress !== derivedAddress) {
      console.warn("⚠️ Perhatian: address pengirim tidak cocok dengan private key!");
    }

    // Simpan public key pengirim agar bisa diverifikasi nanti
    this.senderPublicKey = publicKey;

    const hashTx = this.calculateHash();
    const signature = key.sign(hashTx, "base64");
    this.signature = signature.toDER("hex");
  }

  isValid() {
    // Transaksi reward
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("❌ Transaksi belum ditandatangani!");
    }

    if (!this.senderPublicKey) {
      throw new Error("❌ Transaksi tidak memiliki kunci publik pengirim!");
    }

    // Gunakan public key langsung, bukan address
    const key = ec.keyFromPublic(this.senderPublicKey, "hex");
    return key.verify(this.calculateHash(), this.signature);
  }
}
