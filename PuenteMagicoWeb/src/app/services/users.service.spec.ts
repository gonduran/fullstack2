import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService, User } from './users.service';
import { CryptoService } from './crypto.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  let cryptoService: jasmine.SpyObj<CryptoService>;

  const dummyUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'encryptedPassword', profile: 'admin' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', password: 'encryptedPassword', profile: 'user' }
  ];

  beforeEach(() => {
    const cryptoSpy = jasmine.createSpyObj('CryptoService', ['encrypt', 'decrypt']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsersService,
        { provide: CryptoService, useValue: cryptoSpy }
      ]
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
    cryptoService = TestBed.inject(CryptoService) as jasmine.SpyObj<CryptoService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * @description Verifica que el servicio se haya creado correctamente.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * @description Verifica que el servicio valide las credenciales de inicio de sesión del usuario.
   */
  it('should validate login', () => {
    cryptoService.decrypt.and.returnValue('password');

    service.validateLogin('john@example.com', 'password').subscribe(isValid => {
      expect(isValid).toBeTrue();
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  /**
   * @description Verifica que el servicio obtenga un usuario por su correo electrónico.
   */
  it('should get user by email', () => {
    service.getUserByEmail('john@example.com').subscribe(user => {
      expect(user).toEqual(dummyUsers[0]);
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  /**
   * @description Verifica que el servicio actualice la información de un usuario existente.
   */
  it('should update a user', () => {
    const updatedUser: User = { id: 1, name: 'John Smith', email: 'john@example.com', password: 'newEncryptedPassword', profile: 'admin' };

    service.updateUser(updatedUser).subscribe(users => {
      expect(users[0].name).toBe('John Smith');
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);

    const postReq = httpMock.expectOne(service['jsonUrl']);
    expect(postReq.request.method).toBe('POST');
    postReq.flush([updatedUser, dummyUsers[1]]);
  });

  /**
   * @description Verifica que el servicio agregue un nuevo usuario a la lista.
   */
  it('should add a new user', () => {
    const newUser: User = { id: 3, name: 'New User', email: 'newuser@example.com', password: 'newEncryptedPassword', profile: 'user' };

    service.addUser(newUser).subscribe(users => {
      expect(users.length).toBe(3);
      expect(users[2]).toEqual(newUser);
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);

    const postReq = httpMock.expectOne(service['jsonUrl']);
    expect(postReq.request.method).toBe('POST');
    postReq.flush([...dummyUsers, newUser]);
  });

  /**
   * @description Verifica que el servicio determine si localStorage está disponible.
   */
  it('should check if localStorage is available', () => {
    expect(service.isLocalStorageAvailable()).toBeTrue();
  });

  /**
   * @description Verifica que el servicio establezca el estado de inicio de sesión del usuario.
   */
  it('should set login state', () => {
    const user: User = { id: 1, name: 'John Doe', email: 'john@example.com', password: 'encryptedPassword', profile: 'admin' };
    service.setLoginState(user);
    expect(localStorage.getItem('loggedInUser')).toBe(JSON.stringify(user));
  });

  /**
   * @description Verifica que el servicio determine si el usuario ha iniciado sesión.
   */
  it('should check login state', () => {
    const user: User = { id: 1, name: 'John Doe', email: 'john@example.com', password: 'encryptedPassword', profile: 'admin' };
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    expect(service.checkLoginState()).toBeTrue();
  });

  /**
   * @description Verifica que el servicio cierre la sesión del usuario.
   */
  it('should logout', () => {
    service.logout();
    expect(localStorage.getItem('loggedInUser')).toBeNull();
  });
});