import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { transactions } from "../database/transaction.js";
import {users} from "../database/users.js";
import { generateTransactionId } from "./helper.js";

const transactionFilePath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../database/transaction.json"
);

// load data dari file JSON
export function loadTransactionsFromFile() {
    if (fs.existsSync(transactionFilePath)) {
        const data = fs.readFileSync(transactionFilePath, "utf-8");
        const loadedTransaction = JSON.parse(data);
        if (!Array.isArray(loadedTransaction)) {
            throw new TypeError("Data transaksi harus berupa array.");
        }
        transactions.splice(0, transactions.length, ...loadedTransaction);
        console.log("Data transaksi berhasil dimuat dari transaction.json");
    } else {
        console.log("Belum ada file data transaksi yang tersimpan.");
    }
}

// save data ke file JSON
function saveTransactionsToFile() {
    fs.writeFileSync(transactionFilePath, JSON.stringify(transactions, null, 2));
}

// tambah saldo
export function tambahSaldo(username, nominal, description = "Penambahan saldo") {
    nominal = Number(nominal);
    const user = users.find((users) => users.username === username);
    if (!user) {
        console.log("User tidak ditemukan.");
        return 0;
    }
    if (nominal <= 0) {
        console.log("Nominal harus lebih besar dari 0.");
        return 0;
    }
    createTransaction(username, nominal, description);
    user.saldoTabungan += Number(nominal);
    return console.log(`Saldo sebesar ${nominal} berhasil ditambahkan`);
}

// membuat riwayat transaksi baru
function createTransaction(username, total_amount, description) {
    const newTransaction = {
        id_transaction: generateTransactionId(),
        username: username,
        transaction_date: new Date().toLocaleString(),
        total_amount: total_amount,
        description: description,
    };
    transactions.push(newTransaction);
    saveTransactionsToFile();
    console.log("Transaksi berhasil dibuat.");
}

// lihat total saldo sekarang
export function lihatTotalSaldo(username) {
    const user = users.find((users) => users.username === username);
    if (!user) {
        console.log("User tidak ditemukan.");
        return 0;
    }
    return console.log(`Total saldo ${username}: ${user.saldoTabungan}`);
}

// tarik saldo 
export function tarikSaldo(username, nominal, description = "Pengambilan saldo") {
    nominal = Number(nominal);
    const user = users.find((users) => users.username === username);
    if (!user) {
        console.log("User tidak ditemukan.");
        return 0;
    }
    if (nominal <= 0) {
        console.log("Nominal harus lebih besar dari 0.");
        return 0;
    }
    if (user.saldoTabungan < nominal) {
        console.log("Saldo tidak mencukupi.");
        return 0;
    }
    createTransaction(username, -nominal, description);
    user.saldoTabungan -= Number(nominal);
    return console.log(`Saldo sebesar ${nominal} berhasil diambil`);
}

// lihat riwayat transaksi
export function lihatRiwayatTransaksiPenambahan(username) {
    const userTransactions = transactions.filter((transaction) => {
        return transaction.username === username && transaction.total_amount > 0;
    });
    if (userTransactions.length === 0) {
        console.log("Tidak ada riwayat transaksi deposit untuk user ini.");
        return 0;
    }
    console.log(`Riwayat transaksi deposit: ${username}:`);
    let table = [];
    userTransactions.forEach((transaction) => {
        table.push({
            "id Transaksi": transaction.id_transaction,
            "Tanggal Transaksi": transaction.transaction_date,
            "Deskripsi": transaction.description,
            "Nominal": transaction.total_amount
        });
    });
    let totalDeposit = userTransactions.reduce((total, transaction) => total + transaction.total_amount, 0);
    console.table(table);
    console.log(`Total deposit: ${totalDeposit}`);
}

/* perbedaan .filter() dan .find() adalah:
- .filter() mengembalikan "array" baru yang berisi semua elemen yang memenuhi kondisi tertentu. Jika tidak ada elemen yang memenuhi kondisi, maka akan mengembalikan array kosong.
- .find() mengembalikan "elemen" pertama yang memenuhi kondisi tertentu. Jika tidak ada elemen yang memenuhi kondisi, maka akan mengembalikan undefined.  
makanya kalo ngubah atau nambahin suatu data itu pake .find() , kalo filter itu untuk nampilin data, kelebihan pake filter disini juga karna dia ngembaliin array maka tampilan di comand linenya itu bisa dalam bentuk tabel.
*/

export function lihatRiwayatTransaksiPenarikan(username) {
    const userTransactions = transactions.filter((transaction) => {
        return transaction.username === username && transaction.total_amount < 0;
    });
    if (userTransactions.length === 0) {
        console.log("Tidak ada riwayat transaksi penarikan untuk user ini.");
        return 0;
    }
    console.log(`Riwayat transaksi penarikan: ${username}:`);
    let table = [];
    userTransactions.forEach((transaction) => {
        table.push({
            "id Transaksi": transaction.id_transaction,
            "Tanggal Transaksi": transaction.transaction_date,
            "Deskripsi": transaction.description,
            "Nominal": transaction.total_amount
        });
    });
    let totalPenarikan = userTransactions.reduce((total, transaction) => total + transaction.total_amount, 0);
    console.table(table);
    console.log(`Total penarikan: ${totalPenarikan}`);
}
