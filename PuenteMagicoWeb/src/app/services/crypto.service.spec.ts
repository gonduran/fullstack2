import { TestBed } from '@angular/core/testing';

import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encrypt and decrypt a string correctly', () => {
    const plainText = 'Hello, World!';
    const encryptedText = service.encrypt(plainText);
    expect(encryptedText).not.toEqual(plainText);
    
    const decryptedText = service.decrypt(encryptedText);
    expect(decryptedText).toEqual(plainText);
  });

  it('should return an empty string when decrypting an invalid string', () => {
    const invalidEncryptedText = 'invalid_encrypted_text';
    const decryptedText = service.decrypt(invalidEncryptedText);
    expect(decryptedText).toEqual('');
  });
});
