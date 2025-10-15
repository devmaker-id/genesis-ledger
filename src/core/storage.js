import fs from "fs";
import path from "path";
import { Blockchain } from "./chain.v2.js";

const DATA_DIR = path.resolve("data");
const LEDGER_FILE = path.join(DATA_DIR, "ledger.json");

// Pastikan direktori data ada
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

/**
 * Simpan blockchain ke file ledger.json
 */
export function saveChain(chain) {
  try {
    const json = JSON.stringify(
      {
        chain: chain.chain,
        pendingTransactions: chain.pendingTransactions,
        difficulty: chain.difficulty,
        miningReward: chain.miningReward,
      },
      null,
      2
    );

    fs.writeFileSync(LEDGER_FILE, json, "utf-8");
    console.log(`💾 Ledger disimpan ke: ${LEDGER_FILE}`);
  } catch (err) {
    console.error("❌ Gagal menyimpan ledger:", err.message);
  }
}

/**
 * Muat blockchain dari file ledger.json
 * Jika tidak ada, buat instance baru dari Blockchain
 */
export function loadChain() {
  try {
    if (!fs.existsSync(LEDGER_FILE)) {
      console.log("⚙️ Tidak ada ledger.json, membuat chain baru...");
      return new Blockchain();
    }

    const data = JSON.parse(fs.readFileSync(LEDGER_FILE, "utf-8"));
    const chain = new Blockchain();

    // restore properti chain
    chain.chain = data.chain || [];
    chain.pendingTransactions = data.pendingTransactions || [];
    chain.difficulty = data.difficulty || 2;
    chain.miningReward = data.miningReward || 50;

    console.log(`📂 Ledger dimuat dari: ${LEDGER_FILE}`);
    return chain;
  } catch (err) {
    console.error("❌ Gagal memuat ledger:", err.message);
    return new Blockchain();
  }
}
