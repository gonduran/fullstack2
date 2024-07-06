import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomersService, Customer } from './customers.service';
import { CryptoService } from './crypto.service';

describe('CustomersService', () => {
  let service: CustomersService;
  let httpMock: HttpTestingController;
  let cryptoService: CryptoService;

  const mockCustomers: Customer[] = [
    {
      id: 1,
      clientName: 'John',
      clientSurname: 'Doe',
      email: 'john@example.com',
      password: 'encryptedPassword1',
      birthdate: '2000-01-01',
      dispatchAddress: 'Address 1'
    },
    {
      id: 2,
      clientName: 'Jane',
      clientSurname: 'Smith',
      email: 'jane@example.com',
      password: 'encryptedPassword2',
      birthdate: '1995-05-05',
      dispatchAddress: 'Address 2'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomersService, CryptoService]
    });

    service = TestBed.inject(CustomersService);
    httpMock = TestBed.inject(HttpTestingController);
    cryptoService = TestBed.inject(CryptoService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve customers from JSON', () => {
    service.getCustomers().subscribe(customers => {
      expect(customers.length).toBe(mockCustomers.length); // Ensure the length matches the mock data
      expect(customers).toEqual(mockCustomers);
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });

  it('should validate email', () => {
    service.validateEmail('john@example.com').subscribe(isValid => {
      expect(isValid).toBeTrue();
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });

  it('should validate login', () => {
    spyOn(cryptoService, 'decrypt').and.returnValue('password123');

    service.validateLogin('john@example.com', 'password123').subscribe(isValid => {
      expect(isValid).toBeTrue();
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });

  it('should get customer by email', () => {
    service.getCustomerByEmail('john@example.com').subscribe(customer => {
      expect(customer).toEqual(mockCustomers[0]);
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });

  it('should update customer', () => {
    const updatedCustomer: Customer = {
      ...mockCustomers[0],
      clientName: 'John Updated'
    };

    service.updateCustomer(updatedCustomer).subscribe(customers => {
      expect(customers[0].clientName).toBe('John Updated');
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);

    const postReq = httpMock.expectOne(service['jsonUrl']);
    expect(postReq.request.method).toBe('POST');
    postReq.flush([updatedCustomer, mockCustomers[1]]);
  });

  it('should add a new customer', () => {
    const newCustomer: Customer = {
      id: 0,
      clientName: 'New',
      clientSurname: 'Customer',
      email: 'new@example.com',
      password: 'encryptedPassword3',
      birthdate: '1990-09-09',
      dispatchAddress: 'Address 3'
    };

    service.addCustomer(newCustomer).subscribe(customers => {
      expect(customers.length).toBe(3);
      expect(customers[2].clientName).toBe('New');
    });

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);

    const postReq = httpMock.expectOne(service['jsonUrl']);
    expect(postReq.request.method).toBe('POST');
    newCustomer.id = 3; // Simulate ID assignment
    postReq.flush([...mockCustomers, newCustomer]);
  });

  it('should set and get login state', () => {
    const customer = mockCustomers[0];
    service.setLoginState(customer);
    expect(localStorage.getItem('loggedInClient')).toBe(JSON.stringify(customer));

    const email = service.getLoggedInClientEmail();
    expect(email).toBe(customer.email);
  });

  it('should check login state', () => {
    const customer = mockCustomers[0];
    localStorage.setItem('loggedInClient', JSON.stringify(customer));
    expect(service.checkLoginState()).toBeTrue();

    localStorage.removeItem('loggedInClient');
    expect(service.checkLoginState()).toBeFalse();
  });

  it('should logout', () => {
    const customer = mockCustomers[0];
    localStorage.setItem('loggedInClient', JSON.stringify(customer));
    service.logout();
    expect(localStorage.getItem('loggedInClient')).toBeNull();
  });
});