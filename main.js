import readline from "readline";
import { loadUsersFromFile, 
    saveUsersToFile, 
    createUser,
    loginUser, 
    changePassword, 
    deleteUser, 
    ubahTargetTabungan} from "./function/userFunction.js";
import { loadTransactionsFromFile, 
    tambahSaldo, 
    lihatTotalSaldo,
    tarikSaldo, 
    lihatRiwayatTransaksiPenambahan,
    lihatRiwayatTransaksiPenarikan} from "./function/transactionFunction.js";

// Load data saat awal
loadUsersFromFile();
loadTransactionsFromFile();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function registMenu() {
    rl.question(`
=====================================
selamat datang di tabungan masa depan
=====================================
apakah anda sudah memiliki akun?
y : sudah punya akun
n : belum punya akun
exit : keluar dari program
=====================================
Jawaban:`, (answer) => {
        if (answer.toLowerCase() === "y") {
            console.log("Silakan login.");
            rl.question("Masukkan username: ", (username) => {
                rl.question("Masukkan password: ", (password) => {
                    // Panggil fungsi loginUser di sini
                    const user = loginUser(username, password);
                    if (user === 0) {
                        console.log("Login gagal. Silakan coba lagi.");
                        return registMenu();
                    }
                    // Tambahkan opsi menu setelah login
                    loginMenu(username, password);
                });
            });
        } else if (answer.toLowerCase() === "n") {
            console.log("Silakan registrasi.");
            rl.question("Masukkan username: ", (username) => {
                rl.question("masukan password: ", (password) => {
                    rl.question("masukan target tabungan: ", (targetTabungan) => {
                        createUser({
                        username,
                        password,
                        targetTabungan: Number(targetTabungan)
                    });
                    saveUsersToFile();
                    registMenu(); 
                });
            });
        });
        } else if(answer.toLowerCase() === "exit") {
            console.log("berhasil keluar dari program.");
            rl.close();
        }
        else {
            console.log("Pilihan tidak valid. Silakan pilih 'y', 'n', atau 'exit'.");
            registMenu(); 
        }
    });
}

function showLoginMenu(username) {
    console.log(`\nSelamat datang ${username}\ndi tabungan masa depan. Silakan pilih opsi:
==============================
  SISTEM tabungan masa depan
==============================
1. tambah saldo
2. lihat total saldo dan target tabungan
3. tarik saldo
4. lihat riwayat transaksi deposit
5. lihat riwayat transaksi penarikan
6. hapus akun [pastikan saldo tabungan sudah 0]
7. ubah password
8. mengubah target tabungan
0. Keluar
==============================
`);
}

function loginMenu(username, password) {
    showLoginMenu(username);
    rl.question("Pilih menu (0-7): ", (choice) => {
        switch (choice) {
            case "1":
                // Tambah saldo
                rl.question("Masukkan nominal saldo yang ingin ditambahkan: ", (nominal) => {
                    rl.question("Masukkan deskripsi transaksi: ", (description) => {
                    tambahSaldo(username, nominal, description);
                    saveUsersToFile();
                    rollbackMenuLogin(username, password); 
                    });
                });
                break;
            case "2":
                // Lihat total saldo
                lihatTotalSaldo(username);
                rollbackMenuLogin(username, password); 
                break;
            case "3":
                // Tarik saldo
                rl.question("Masukkan nominal saldo yang ingin ditarik: ", (nominal) => {
                    rl.question("Masukkan deskripsi transaksi: ", (description) => {
                    tarikSaldo(username, nominal, description);
                    saveUsersToFile();
                    rollbackMenuLogin(username, password); 
                    });
                });
                break;
            case "4":
                lihatRiwayatTransaksiPenambahan(username);
                rollbackMenuLogin(username, password); 
                break;
            case "5":
                lihatRiwayatTransaksiPenarikan(username);
                rollbackMenuLogin(username, password); 
                break;
            case "6":
                rl.question("Apakah Anda yakin ingin menghapus akun? (y/n): ", (confirm) => {
                    if (confirm.toLowerCase() === "y") {
                        deleteUser(username);
                    }
                    rollbackMenuLogin(username, password); 
                });
                break;
            case "7":
                // ubah password
                rl.question("masukan password baru: ", (newPassword) => {
                    changePassword(username, password, newPassword);
                    saveUsersToFile();
                    console.log("Password berhasil diubah.");
                    rollbackMenuLogin(username, password); 
                });
                break;
            case "8":
                // ubah target tabungan
                rl.question("masukan target tabungan baru: ", (newTarget) => {
                    ubahTargetTabungan(username, newTarget);
                    saveUsersToFile();
                    rollbackMenuLogin(username, password); 
                });
                break;
            case "0":
                console.log("Keluar dari program.");
                registMenu(); // Kembali ke menu registrasi setelah keluar
                break;
            default:
                console.log("Pilihan tidak valid. Silakan pilih menu (0-7).");
                loginMenu(username, password); // Panggil kembali menu login jika pilihan tidak valid
        }
    });
};

function rollbackMenuLogin(username, password) {
    rl.question("isi apapun jika ingin kembali ke menu: ", (answer) => {
        if (answer.toLowerCase() !== "") {
            return loginMenu(username, password); // Panggil kembali menu login setelah menambahkan saldo
        } else {
            return rollbackMenuLogin(username, password); // Panggil kembali rollbackMenu jika input kosong
        }
    });
};

registMenu();

/*
jadi di atas itu contoh registnya, nanti kita buat else if juga antara dia udh punya akun atau belum, trus kalo udh punya akun tinggal ke segmen login baru di segmen login karna fiturnya lumayan banyak dan kita bisa ngasih opsi jadi pake switch case aja biar lebih rapi, kalo misal usernya udh punya akun tinggal login aja, kalo belum ya registrasi dulu, nanti kalo udh login baru kita kasih opsi buat liat data transaksi, tambah transaksi, hapus transaksi, edit transaksi, dan liat data usernya juga.
*/ 