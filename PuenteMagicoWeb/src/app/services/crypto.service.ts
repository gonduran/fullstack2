import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private secretKey: string = 'Pu3nt3M4g1c0'; // Cambia esto por tu clave secreta

  constructor() { }

  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
