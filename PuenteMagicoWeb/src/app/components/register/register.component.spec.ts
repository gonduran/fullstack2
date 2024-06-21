import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent]
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
      'birthDate'
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

  it('should make the birthDate control required', () => {
    let control = component.registerForm.get('birthDate');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should call onSubmit and save the data to localStorage', () => {
    spyOn(localStorage, 'setItem');
    spyOn(window, 'alert');
    component.registerForm.setValue({
      clientName: 'John',
      clientSurname: 'Doe',
      email: 'john@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
      birthDate: '2000-01-01'
    });
    component.onSubmit();
    expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({
      clientName: 'John',
      clientSurname: 'Doe',
      email: 'john@example.com',
      birthDate: '2000-01-01'
    }));
    expect(window.alert).toHaveBeenCalledWith('Registro exitoso!');
  });

  it('should call onReset and reset the form', () => {
    component.registerForm.setValue({
      clientName: 'John',
      clientSurname: 'Doe',
      email: 'john@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
      birthDate: '2000-01-01'
    });
    component.onReset();
    expect(component.registerForm.value).toEqual({
      clientName: '',
      clientSurname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: ''
    });
  });
});
