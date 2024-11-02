const crypto = require("crypto");

class AppSecurity {
  #enKey;
  #algorithm;

  constructor(key, algorithm = "aes-256-cbc") {
    this.#algorithm = algorithm;
    this.#enKey = Buffer.from(key);
  }

  #generateIV() {
    const timestamp = Date.now();
    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer);

    view.setBigUint64(0, BigInt(timestamp), false);

    for (let i = 8; i < 16; i++) {
      view.setUint8(i, Math.floor(Math.random() * 256));
    }

    let hexString = "";
    for (let i = 0; i < 16; i++) {
      hexString += view.getUint8(i).toString(16).padStart(2, "0");
    }

    return hexString.slice(0, 16);
  }

  encryptString(text) {
    const iv = Buffer.from(this.#generateIV());
    const cipher = crypto.createCipheriv(this.#algorithm, this.#enKey, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return new EncryptedString(iv.toString("hex"), encrypted);
  }

  decryptString(encryptedData, iv) {
    const decipher = crypto.createDecipheriv(
      this.#algorithm,
      this.#enKey,
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}

class EncryptedString {
  constructor(iv, encryptedData) {
    this.iv = iv;
    this.encryptedData = encryptedData;
  }
}

module.exports = { AppSecurity, EncryptedString };
