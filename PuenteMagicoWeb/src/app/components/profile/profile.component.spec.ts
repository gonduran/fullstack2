import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NavigationService } from '../../services/navigation.service';
import { CustomersService, Customer } from '../../services/customers.service';
import { CryptoService } from '../../services/crypto.service';
import { Renderer2, ElementRef, PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let customersService: jasmine.SpyObj<CustomersService>;
  let cryptoService: jasmine.SpyObj<CryptoService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const customersServiceSpy = jasmine.createSpyObj('CustomersService', ['getCustomerByEmail', 'updateCustomer', 'checkLoginState', 'getLoggedInClientEmail', 'mostrarAlerta']);
    const cryptoServiceSpy = jasmine.createSpyObj('CryptoService', ['encrypt', 'decrypt']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, CommonModule, RouterTestingModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        NavigationService,
        { provide: CustomersService, useValue: customersServiceSpy },
        { provide: CryptoService, useValue: cryptoServiceSpy },
        { provide: Renderer2, useValue: {} },
        { provide: ElementRef, useValue: {} },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    customersService = TestBed.inject(CustomersService) as jasmine.SpyObj<CustomersService>;
    cryptoService = TestBed.inject(CryptoService) as jasmine.SpyObj<CryptoService>;
    httpMock = TestBed.inject(HttpTestingController);

    customersService.getCustomerByEmail.and.returnValue(of({
      id: 1,
      clientName: 'John',
      clientSurname: 'Doe',
      email: 'john.doe@example.com',
      password: 'encryptedPassword',
      birthdate: '2000-01-01',
      dispatchAddress: '123 Main St'
    }));

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});