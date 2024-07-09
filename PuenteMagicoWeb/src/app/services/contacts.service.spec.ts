import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContactsService, Contact } from './contacts.service';
import { HttpClient } from '@angular/common/http';

describe('ContactsService', () => {
  let service: ContactsService;
  let httpMock: HttpTestingController;

  /**
   * @description 
   * Configuración del módulo de pruebas antes de cada prueba.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactsService]
    });
    service = TestBed.inject(ContactsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  /**
   * @description 
   * Verifica que no haya solicitudes pendientes después de cada prueba.
   */
  afterEach(() => {
    httpMock.verify();
  });

  /**
   * @description 
   * Verifica que el servicio se haya creado correctamente.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * @description 
   * Prueba para obtener la lista de contactos desde el archivo JSON.
   */
  it('should retrieve contacts from JSON', () => {
    const mockContacts: Contact[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123456789', subject: 'Subject 1', message: 'Message 1', fecha: '2023-06-21', estado: 'new' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '987654321', subject: 'Subject 2', message: 'Message 2', fecha: '2023-06-22', estado: 'new' }
    ];

    service.getContacts().subscribe(contacts => {
      expect(contacts.length).toBe(2);
      expect(contacts).toEqual(mockContacts);
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts);
  });

  /**
   * @description 
   * Prueba para agregar un nuevo contacto a la lista.
   */
  it('should add a new contact', () => {
    const mockContacts: Contact[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123456789', subject: 'Subject 1', message: 'Message 1', fecha: '2023-06-21', estado: 'new' }
    ];

    const newContact: Contact = { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '987654321', subject: 'Subject 2', message: 'Message 2', fecha: '2023-06-22', estado: 'new' };

    service.addContact(newContact).subscribe(contacts => {
      expect(contacts.length).toBe(2);
      expect(contacts.find(c => c.id === 2)).toEqual(newContact);
    });

    const getReq = httpMock.expectOne(service['jsonUrl']);
    getReq.flush(mockContacts);

    const postReq = httpMock.expectOne(service['jsonUrl']);
    expect(postReq.request.method).toBe('POST');
    postReq.flush([...mockContacts, newContact]);
  });

  /**
   * @description 
   * Prueba para formatear una fecha de YYYY-MM-DD a DD-MM-YYYY.
   */
  it('should format date from YYYY-MM-DD to DD-MM-YYYY', () => {
    const date = '2023-06-21';
    const formattedDate = service['formatToFormDate'](date);
    expect(formattedDate).toBe('21-06-2023');
  });

  /**
   * @description 
   * Prueba para formatear una fecha de DD-MM-YYYY a YYYY-MM-DD.
   */
  it('should format date from DD-MM-YYYY to YYYY-MM-DD', () => {
    const date = '21-06-2023';
    const formattedDate = service['formatToStorageDate'](date);
    expect(formattedDate).toBe('2023-06-21');
  });
});