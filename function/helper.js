// fungsi pembantu
import bcrypt from "bcrypt";


export function generateTransactionId() {
    const timestamp = Date.now().toString();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return timestamp + randomNum;
}

export function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

export function comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}


