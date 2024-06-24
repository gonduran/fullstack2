import { TestBed } from '@angular/core/testing';
import { ContactsService } from './contacts.service';

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactsService);
    localStorage.clear(); // Limpiar localStorage antes de cada prueba
  });

  /**
   * @description 
   * Verifica que el servicio se crea correctamente.
   * 
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * @description 
   * Verifica que un contacto puede ser encontrado por su ID.
   * 
   */
  it('should find a contact by id', () => {
    service.registerContacts('John Doe', 'john@example.com', '123456789', 'Subject', 'Message');
    const contacts = service.getContacts();
    const contactId = contacts[0].id;
    const result = service.findContact(contactId);
    expect(result).toBeTrue();
  });

  /**
   * @description 
   * Verifica que el servicio retorna false cuando se intenta encontrar un contacto inexistente.
   * 
   */
  it('should return false when trying to find a non-existent contact', () => {
    const result = service.findContact(999);
    expect(result).toBeFalse();
  });

  /**
   * @description 
   * Verifica si el localStorage está disponible.
   * 
   */
  it('should check if localStorage is available', () => {
    expect(service.isLocalStorageAvailable()).toBeTrue();
  });

  /**
   * @description 
   * Verifica que las fechas se formatean correctamente de YYYY-MM-DD a DD-MM-YYYY.
   * 
   */
  it('should format dates correctly', () => {
    const formDate = service['formatToFormDate']('2024-06-21');
    expect(formDate).toBe('21-06-2024');
    const storageDate = service['formatToStorageDate']('21-06-2024');
    expect(storageDate).toBe('2024-06-21');
  });
});
