import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as CryptoJS from 'crypto-js';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with 6 controls', () => {
    expect(Object.keys(component.registerForm.controls)).toEqual([
      'clientName',
      'clientSurname',
      'email',
      'password',
      'confirmPassword',
      'birthdate',
      'dispatchAddress'
    ]);
  });

  it('should make the clientName control required', () => {
    let control = component.registerForm.get('clientName');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the clientSurname control required', () => {
    let control = component.registerForm.get('clientSurname');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the email control required and validate format', () => {
    let control = component.registerForm.get('email');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
    control?.setValue('invalid-email');
    expect(control?.valid).toBeFalsy();
    control?.setValue('test@example.com');
    expect(control?.valid).toBeTruthy();
  });

  it('should validate password pattern', () => {
    let control = component.registerForm.get('password');
    control?.setValue('password');
    expect(control?.valid).toBeFalsy();
    control?.setValue('Password1');
    expect(control?.valid).toBeTruthy();
  });

  it('should check if passwords match', () => {
    let passwordControl = component.registerForm.get('password');
    let confirmPasswordControl = component.registerForm.get('confirmPassword');
    passwordControl?.setValue('Password1');
    confirmPasswordControl?.setValue('Password2');
    expect(component.registerForm.hasError('mismatch')).toBeTruthy();
    confirmPasswordControl?.setValue('Password1');
    expect(component.registerForm.hasError('mismatch')).toBeFalsy();
  });

  it('should make the birthdate control required', () => {
    let control = component.registerForm.get('birthdate');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should encrypt the password on submit', () => {
    const form = component.registerForm;
    form.controls['clientName'].setValue('John');
    form.controls['clientSurname'].setValue('Doe');
    form.controls['email'].setValue('john@example.com');
    form.controls['password'].setValue('Password1');
    form.controls['confirmPassword'].setValue('Password1');
    form.controls['birthdate'].setValue('2000-01-01');
    form.controls['dispatchAddress'].setValue('Address');

    const spy = spyOn(CryptoJS.AES, 'encrypt').and.callThrough();
    component.onSubmit();

    expect(spy).toHaveBeenCalledWith('Password1', 'Pu3nt3M4g1c0');
  });

  it('should not submit if form is invalid', () => {
    const form = component.registerForm;
    form.controls['clientName'].setValue('');
    form.controls['clientSurname'].setValue('');
    form.controls['email'].setValue('invalidemail');
    form.controls['password'].setValue('short');
    form.controls['confirmPassword'].setValue('short');
    form.controls['birthdate'].setValue('');
    form.controls['dispatchAddress'].setValue('');

    const spy = spyOn(CryptoJS.AES, 'encrypt').and.callThrough();
    component.onSubmit();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call onReset and reset the form', () => {
    component.registerForm.setValue({
      clientName: 'John',
      clientSurname: 'Doe',
      email: 'john@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
      birthdate: '2000-01-01',
      dispatchAddress: 'Address'
    });
    
    component.onReset();
    
    expect(component.registerForm.value).toEqual({
      clientName: '',
      clientSurname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      dispatchAddress: ''
    });
  });

/*  it('should call onSubmit and save the data to localStorage', () => {
    spyOn(localStorage, 'setItem').and.callThrough();
    spyOn(window, 'alert');
    component.registerForm.setValue({
      clientName: 'John',
      clientSurname: 'Doe',
      email: 'john@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
      birthdate: '2000-01-01',
      dispatchAddress: 'Address'
    });

    component.onSubmit();

    const encryptedPassword = CryptoJS.AES.encrypt('Password1', 'Pu3nt3M4g1c0').toString();
    const expectedData = JSON.stringify([{
      clientName: 'John',
      clientSurname: 'Doe',
      email: 'john@example.com',
      password: encryptedPassword,
      birthdate: '2000-01-01',
      dispatchAddress: 'Address'
    }]);

    expect(localStorage.setItem).toHaveBeenCalledWith('customers', expectedData);
    expect(window.alert).toHaveBeenCalledWith('Registro exitoso!');
  });*/
});
