import fs from "fs";
import {users} from "../database/users.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { hashPassword, comparePassword } from "./helper.js";
import { hapusTransaksi} from "./transactionFunction.js";

const userFilePath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../database/users.json"
);


// Load data dari file JSON (jika ada)
export function loadUsersFromFile() {
    if (fs.existsSync(userFilePath)) {
        const data = fs.readFileSync(userFilePath, "utf8");
        const loadedUsers = JSON.parse(data); // perlu di reasoning lagi
        if (!Array.isArray(loadedUsers)) {
            throw new TypeError("Data pengguna harus berupa array.");
        }
        users.splice(0, users.length, ...loadedUsers);
        console.log("Data pengguna berhasil dimuat dari users.json");
    } else {
        console.log("Belum ada file data pengguna yang tersimpan.");
    }
}

// Save data ke file JSON  
export function saveUsersToFile() {
    fs.writeFileSync(userFilePath, JSON.stringify (users, null, 2));
} // reasoning

//create user
export function createUser(newUser) {
    // Validasi data
    if (!newUser.username || !newUser.password || !newUser.targetTabungan) {
        console.log("Register akun gagal, Semua field wajib diisi!");
        return;
    }
    // Cek apakah username sudah ada (pake method .find())
    if (users.find(users => users.username === newUser.username)) {
        console.log(`Username ${newUser.username} sudah ada! akun tidak dapat dibuat.`);
        return;
    }

    newUser.password = hashPassword(newUser.password);
    newUser.saldoTabungan = 0; // Set saldo default
    users.push(newUser);
    console.log("Pengguna berhasil dibuat. silahkan login dengan username dan password yang telah dibuat.");
}

// ubah password user
export function changePassword(username, oldPassword, newPassword) {
    const user = users.find(user => user.username === username);
    if (!user) {
        console.log("Username tidak ditemukan.");
        return;
    }
    const isPasswordValid = comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
        console.log("Password lama salah.");
        return;
    }
    user.password = hashPassword(newPassword);
    console.log("Password berhasil diubah.");
}

//login user
export function loginUser(username, password) {
    // Cari objek pengguna berdasarkan username method .find()
    // .find() akan mengembalikan objek pengguna pertama yang cocok dan passwordnya juga mengikuti
    const user = users.find(user => user.username === username);
    if (!user) {
        console.log("Username tidak ditemukan.");
        return 0; 
    }
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
        console.log("Password salah.");
        return 0; 
    }
    console.log("Login berhasil.");
    return 1;
}

export function ubahTargetTabungan(username, newTarget) {
    const user = users.find(user => user.username === username);
    if (!user) {
        console.log("Username tidak ditemukan.");
        return 0;
    }
    user.targetTabungan = Number(newTarget);
    console.log("Target tabungan berhasil diubah.");
}

export function deleteUser(username) {
    const user = users.find((users) => users.username === username);
    if (!user) {
        console.log("User tidak ditemukan.");
        return 0;
    }
    if (user.saldoTabungan !== 0) {
        console.log("Saldo tabungan harus 0 untuk menghapus akun.");
        return 0;
    }
    
    const userIndex = users.find((users) => users.username === username);
    users.splice(users.indexOf(userIndex), 1);
    console.log(`Akun ${username} berhasil dihapus.`);
    saveUsersToFile();
    hapusTransaksi(username);
}

