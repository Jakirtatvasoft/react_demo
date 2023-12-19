import { LocalStorageUserInfoDataType } from '../Types';
import config from '../config.json'
import CryptoJS from 'crypto-js'

const key = config.encryptionKey;

export const encryptData = (data: string) => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });
  return JSON.stringify({
    iv: iv.toString(),
    encryptedData: encrypted.toString()
  });
}

export const decryptData = ({encryptedData, iv}: LocalStorageUserInfoDataType) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv: CryptoJS.enc.Hex.parse(iv) });
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
}
