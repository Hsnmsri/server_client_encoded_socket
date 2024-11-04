const Encription = require("../Encryption");

class MessageEncryptor {
  constructor(encryptionKey) {
    this.encriptionObj = new Encription.AppSecurity(encryptionKey);
  }

  decrypt(encryptedData, iv) {
    return this.encriptionObj.decryptString(encryptedData, iv);
  }
}

module.exports = MessageEncryptor;
