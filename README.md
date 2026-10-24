

# PROGRAM Tabungan
program tabungan ini adalah membuat wadah untuk seseorang yang ingin menabung dan mencatat setiap tabungan yang ia berikan seperti nilai uang yang sudah ia keluarkan dan kapan ia mulai menabung. di sini juga memungkinkan kamu mentracking seberapa progress tabungan kamu dengan target tabungan yang sudah ada. disini karena sistemnya tabungan maka kita menyediakan fitur register,login, dan logout

# fitur
pembuatan akun 
login akun/masuk akun
logout akun
menambah uang tabungan
menarik uang tabungan
melihat sisa uang tabungan dan progress tabungan dengan target
melihat riwayat transaksi penabungan
melihat riwayat transaksi penarikan tabungan
menghapus akun
mengubah password
mengubah target tabungan


# cara menjalankan
- Pastikan Node.js sudah terinstal.
- Buka terminal dan arahkan ke folder proyek.
- Ubah package.json agar menggunakan module.
- ketik npm install di terminal untuk dependenci program
- Jalankan program dengan : node main.js

# format data 
## format user
    {
        username: "virgi",
        password: "$2b$10$Kx9sUdPcCrpthc96GYsB.O2qfi2ikVlg9We7xiJoDeNFHGN2KcHLe",
        saldoTabungan: 140000,
        targetTabungan: 1000000
    }

## format transaksi
    {
        id_transaction: "17927165414767815",
        username: "virgi",
        transaction_date: "23/10/2026, 07.49.01",
        total_amount: 70000,
        description: "uang lembur"
    }

# struktur project
- `.gitignore`        -> untuk mengabaikan node_modules karna saya pakai bcrypt dan otomatis menambahkan node_modules di dalam folder function, maka dari itu juga perlu npm install bcrypt untuk menjalankanya
- `main.js`           -> proses berjalanya program utama
- `package-lock.json` -> memastikan versi dependency dan yang lainya sama sehingga program ini dapat berjalan sesuai
- `package.json`      -> Konfigurasi Node.js project
### folder database
- `transaction.js`   -> Berisi array data transaksi awal atau formatnya
- `transaction.json` -> penyimpanan yang otomatis dibuat mengenai transaksi
- `users.js`         -> Berisi array data user awal atau formatnya
- `users.json`       -> penyimpanan yang otomatis dibuat mengenai data pengguna
### folder fucntion
- `helper.js`        -> berisi fungsi pembantu yang akan dipakai di 2 fungsi utama
- `transactionfungsion.js`   -> berisi fungsi dari proses Transaksi dan pembuatan riwayat transaksi
- `userFunction.js`  -> berisi fungsi dari proses CRUD User



# alur program/ penggunaan
1.  login/regist akun, atau exit untuk mengakhiri program
2.  lalu nanti akan masuk ke menu baru yaitu menu login, dan disitu lah fitur fitur tabungan yang sudah di sediakan
3. bisa pilih angka 0-8 sesuai yang di inginkan
4. jika ingin mengakhiri program ketik 0 pada login menu, dan exit pada menu awal

# Requirements
- Node.js v24.20.0
- Terminal/Command Prompt

# Author
- Nama: Virgiawan Yuda Nugroho
- Tema Proyek: pencatatan tabungan
- Kelas: Trial Study Club Backend Basic KSM Veteran Tech 2026
- Mentor: Nadia Jasmine Aulia