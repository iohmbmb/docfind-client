import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup';
import {provideRouter, Router} from '@angular/router';
import { UserRole } from "@shared/models/user.types";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import { environment } from "src/environments/environment.development";

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [provideRouter([]), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;

    // Crucial for initialization side-effects
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(async () => {
    // Force lingering validation streams to flush cleanly before tearing down the injector
    await new Promise(resolve => setTimeout(resolve, 0));
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // 💡 FIX: Made async and added macro-task flush
  it('should display email error message', async () => {
    const emailInput = fixture.nativeElement.querySelector('[data-testid="email-field"]');
    let emailError = fixture.nativeElement.querySelector('[data-testid="email-error"]');
    expect(emailError).toBeNull();

    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));

    emailError = fixture.nativeElement.querySelector('[data-testid="email-error"]');
    expect(emailError).toBeTruthy();
    expect(emailError.textContent).toContain('Email is required');
  });

  it('should display password error messages', async () => {
    const passwordInput = fixture.nativeElement.querySelector('[data-testid="password-field"]');
    let passwordError = fixture.nativeElement.querySelector('[data-testid="password-error"]');

    passwordInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));

    passwordError = fixture.nativeElement.querySelector('[data-testid="password-error"]');
    expect(passwordError).toBeTruthy();
    expect(passwordError.textContent).toContain('Password is required');
  });

  // 💡 FIX: Made async and added macro-task flush
  it('should update password rules indicator', async () => {
    const passwordInput = fixture.nativeElement.querySelector('[data-testid="password-field"]');
    let passrule1 = fixture.nativeElement.querySelector('[data-testid="pass-rule-1"]');

    expect(passrule1.textContent).toEqual('•');

    passwordInput.value = 'Po87@ejU';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));

    passrule1 = fixture.nativeElement.querySelector('[data-testid="pass-rule-1"]');
    expect(passrule1.textContent).toEqual('✓');
  });

  // 💡 FIX: Made async and added macro-task flush
  it('should display firstName error message', async () => {
    const firstnameInput = fixture.nativeElement.querySelector('[data-testid="firstname-field"]');
    firstnameInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));

    const firstnameError = fixture.nativeElement.querySelector('[data-testid="firstname-error"]');
    expect(firstnameError).toBeTruthy();
    expect(firstnameError.textContent).toEqual('First name is required');
  });

  // 💡 FIX: Made async and added macro-task flush
  it('should display lastName error message', async () => {
    const lastnameInput = fixture.nativeElement.querySelector('[data-testid="lastname-field"]');
    lastnameInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));

    const lastnameError = fixture.nativeElement.querySelector('[data-testid="lastname-error"]');
    expect(lastnameError).toBeTruthy();
    expect(lastnameError.textContent).toEqual('Last name is required');
  });

  it('should update submit button', () => {
    let submitBtn = fixture.nativeElement.querySelector('[data-testid="btn-submit"]');
    expect(submitBtn.textContent).toEqual(' Create account');

    component.isLoading.set(true);
    fixture.detectChanges();

    submitBtn = fixture.nativeElement.querySelector('[data-testid="btn-submit"]');
    expect(submitBtn.textContent).toEqual(' Registering...');
  });

  it('should submit the form', async () => {
    const router = TestBed.inject(Router);
    const httpTestingController = TestBed.inject(HttpTestingController);
    const spyOnRouter = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    localStorage.clear();

    component.signupModel.set({
      email: 'test@mail.com',
      password: 'Po87@ejU',
      firstName: 'valid-firstname',
      lastName: 'valid-lastname',
      role: UserRole.patient
    });

    component.rememberMe = true;
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(localStorage.length).toEqual(1);
    expect(component.isLoading()).toEqual(false);
    expect(spyOnRouter).toHaveBeenCalledWith(['/bookings']);
  });

  it('should submit the form and catch an error', async () => {
    const router = TestBed.inject(Router);
    const httpTestingController = TestBed.inject(HttpTestingController);
    const spyOnRouter = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    localStorage.clear();

    component.signupModel.set({
      email: 'test@mail.com',
      password: 'Po87@ejU',
      firstName: 'valid-firstname',
      lastName: 'valid-lastname',
      role: UserRole.patient
    });

    component.rememberMe = false;
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.error(new ProgressEvent('error'), {
      status: 409,
      statusText: 'Conflict'
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(localStorage.length).toEqual(0);
    expect(component.isLoading()).toEqual(false);
    expect(component.errorMessage()).toEqual('User already exists or registration rejected.');
    expect(spyOnRouter).not.toHaveBeenCalled();
  });
});
