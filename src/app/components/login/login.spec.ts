import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import {provideRouter, Router} from '@angular/router';
import {HttpTestingController,  provideHttpClientTesting} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment.development';
import {LoginResponse} from '@shared/models/login.types';
import {UserRole, User} from '@shared/models/user.types';
import {Identity} from '@shared/models/identity.types';

describe('Login', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the component model when text is entered', async () => {
    const emailInput = fixture.nativeElement.querySelector('input[name="email"]');
    const passwordInput = fixture.nativeElement.querySelector('input[name="password"]');
    emailInput.value = 'test@mail.com';
    passwordInput.value = 'valid-password';

    emailInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await fixture.whenStable();
    expect(component.credentials.email).toEqual('test@mail.com');
    expect(component.credentials.password).toEqual('valid-password');
  });

  it('should display an error message if there is one', () =>{
    expect(component.errorMessage()).toEqual("");
    let errorMessage = fixture.nativeElement.querySelector('[data-testid="error-msg"]');
    expect(errorMessage).toBeNull();
    component.errorMessage.set('Extremely bad password');
    fixture.detectChanges();
    errorMessage = fixture.nativeElement.querySelector('[data-testid="error-msg"]');
    expect(errorMessage).toBeTruthy();
    expect(component.errorMessage()).toEqual("Extremely bad password");
    expect(errorMessage.textContent).toEqual(' Extremely bad password '); // For some reason the spaces are useful.
  });

  it('should submit the form when the button is clicked', () =>{
    const spyOnSubmit = vi.spyOn(component, 'onSubmit');
    const btnElement = fixture.nativeElement.querySelector('[data-testid="btn-submit"]');
    expect(btnElement.textContent).toEqual('Log in');
    btnElement.click();
    fixture.detectChanges();
    expect(spyOnSubmit).toHaveBeenCalled();
    expect(btnElement.textContent).toEqual('Authenticating...');
  })

  it('should log in the user', async () =>{
    const router = TestBed.inject(Router);
    const spyOnRouter = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const httpTestingController = TestBed.inject(HttpTestingController);
    localStorage.clear();
    const validUser : User = {
      id: 'valid-id',
      email: 'test@mail.com',
      firstName: 'valid-firstname',
      lastName: 'valid-lastname',
      role: UserRole.patient,
    };
    const response : LoginResponse = {
      token: 'valid-token',
      user: validUser
    };
    const identityResponse : Identity = {
      id: 'valid-id'
    };

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isLoading()).toEqual(false);
    expect(component.errorMessage()).toEqual('');

    const emailInput = fixture.nativeElement.querySelector('input[name="email"]');
    const passwordInput = fixture.nativeElement.querySelector('input[name="password"]');
    emailInput.value = 'test@mail.com';
    passwordInput.value = 'valid-password';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    component.rememberMe.set(true);

    fixture.detectChanges();
    await fixture.whenStable();


    component.onSubmit();
    fixture.detectChanges();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(response);

    await new Promise(resolve => setTimeout(resolve, 0));
    fixture.detectChanges();

    const identityReq = httpTestingController.expectOne(`${environment.apiUrl}/auth/me`);
    expect(identityReq.request.method).toBe('GET');
    identityReq.flush(identityResponse);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(localStorage.length).toEqual(5);
    expect(spyOnRouter).toHaveBeenCalledWith(['/bookings']);
    expect(localStorage.getItem('remember_user_email')).toEqual('test@mail.com')
  });


  it('should catch errors', async () =>{
    const router = TestBed.inject(Router);
    const spyOnRouter = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const httpTestingController = TestBed.inject(HttpTestingController);
    localStorage.clear();
    const validUser : User = {
      id: 'valid-id',
      email: 'test@mail.com',
      firstName: 'valid-firstname',
      lastName: 'valid-lastname',
      role: UserRole.patient,
    };
    const response : LoginResponse = {
      token: 'valid-token',
      user: validUser
    };
    const identityResponse : Identity = {
      id: 'valid-id'
    };

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isLoading()).toEqual(false);
    expect(component.errorMessage()).toEqual('');

    const emailInput = fixture.nativeElement.querySelector('input[name="email"]');
    const passwordInput = fixture.nativeElement.querySelector('input[name="password"]');
    emailInput.value = 'test@mail.com';
    passwordInput.value = 'valid-password';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));
    component.rememberMe.set(false);

    fixture.detectChanges();
    await fixture.whenStable();


    component.onSubmit();
    fixture.detectChanges();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.error(new ProgressEvent('error'), {
      status: 409,
      statusText: 'Conflict'
    })

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(component.isLoading()).toEqual(false);
    expect(spyOnRouter).not.toHaveBeenCalled();
    expect(component.errorMessage()).toEqual('Invalid email or password. Please try again.');
  });

});
