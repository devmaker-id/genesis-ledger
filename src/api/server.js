import express from "express";
import bodyParser from "body-parser";
import { loadChain, saveChain } from "../core/storage.js";
import { Transaction } from "../core/transaction.js";
import { Blockchain } from "../core/chain.v2.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// === Muat atau buat blockchain ===
let ledger = loadChain();

// === Endpoint: lihat seluruh chain ===
app.get("/chain", (req, res) => {
  res.json(ledger.chain);
});

// === Endpoint: kirim transaksi baru ===
app.post("/transaction", (req, res) => {
  try {
    const { from, to, amount, privateKey } = req.body;

    if (!from || !to || !amount || !privateKey) {
      return res.status(400).json({ error: "Data transaksi tidak lengkap!" });
    }

    const tx = new Transaction(from, to, amount);
    tx.signTransaction({ privateKey });

    ledger.addTransaction(tx);
    saveChain(ledger);

    res.json({ message: "✅ Transaksi ditambahkan ke pendingTransactions.", tx });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Endpoint: mining ===
app.post("/mine/:miner", (req, res) => {
  try {
    const minerAddress = req.params.miner;
    ledger.minePendingTransactions(minerAddress);
    saveChain(ledger);

    res.json({
      message: `✅ Block mined oleh ${minerAddress}`,
      latestBlock: ledger.getLatestBlock(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Endpoint: cek saldo ===
app.get("/balance/:address", (req, res) => {
  try {
    const address = req.params.address;
    const balance = ledger.getBalanceOfAddress(address);
    res.json({ address, balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Jalankan server ===
app.listen(PORT, () => {
  console.log(`🚀 Genesis Ledger API running at http://localhost:${PORT}`);
});
