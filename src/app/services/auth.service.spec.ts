import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {DoctorRegisterRequest, UserRegisterRequest} from '@shared/models/register.types';
import {User, UserRole} from '@shared/models/user.types';
import {environment} from '../../environments/environment.development';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {Identity} from '@shared/models/identity.types';
import {LoginRequest, LoginResponse} from '@shared/models/login.types';
import {PasswordRequest} from '@shared/models/password-request.types';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const registerReq : UserRegisterRequest = {
      email: 'valid-mail',
      password: 'valid-password',
      firstName: 'valid-firstname',
      lastName: 'valid-lastname',
      role: UserRole.patient
    };
    service.registerUser(registerReq).subscribe(res => {
      expect(res).toEqual(registerReq);
    });
    const request = httpTestingController.expectOne(`${environment.apiUrl}/auth/register`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(registerReq);
    request.flush(registerReq);
  })

  it('should register a doctor', () => {
    const registerReq : DoctorRegisterRequest = {
      email: 'valid-mail',
      password: 'valid-password',
      firstName: 'valid-firstname',
      lastName: 'valid-lastname',
      role: UserRole.doctor,
      practiceName: 'valid-practice',
      practiceAddress: 'valid-address',
      practiceSuburb: 'valid-suburbs',
      practiceState: 'valid-state',
      practicePostcode: 'valid-postcode',
      practicePhone: 'valid-phone',
      hourlyRate: 20,
      specialty: PracticeSpecialty.Cardiology,
      longitude: 1.23,
      latitude: 0.34
    };

    service.registerDoctor(registerReq).subscribe(res => {
      expect(res).toEqual(registerReq);
    })

    const request = httpTestingController.expectOne(`${environment.apiUrl}/auth/register`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(registerReq);
    request.flush(registerReq);
  })

  it('should get id of user', () => {
    const userId : Identity = {
      id: 'valid-id'
    };
    service.getId().subscribe(res => {
      expect(res).toEqual(userId);
    });
    const request = httpTestingController.expectOne(`${environment.apiUrl}/auth/me`);
    expect(request.request.method).toBe('GET');
    request.flush(userId);
  })

  it('should handle login request', () => {
    const logRequest : LoginRequest = {
      email: 'valid-mail',
      password: 'valid-password'
    };
    const validUser : User = {
      id: 'valid-id',
      email: 'valid-mail',
      firstName: 'valid-firstname',
      lastName: 'valid-lastname',
      role: UserRole.patient,
    };
    const loginResponse : LoginResponse = {
      token: 'valid-token',
      user: validUser
    };

    const spySessionStorage = vi.spyOn(service, 'setSession');

    service.loginRequest(logRequest).subscribe(res => {
      expect(res).toEqual(loginResponse);
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(logRequest);
    request.flush(loginResponse);
    expect(spySessionStorage).toHaveBeenCalledOnce();
    expect(spySessionStorage).toHaveBeenCalledWith(loginResponse);
  })

  it('should handle password updated', () => {
    const passRequest : PasswordRequest = {
      currentPassword: 'old-password',
      newPassword: 'new-password'
    };

    service.updatePassword(passRequest).subscribe(res => {})

    const request = httpTestingController.expectOne(`${environment.apiUrl}/auth/update/password`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(passRequest);
    request.flush({});
  })

  it('should handle logout', () => {
    localStorage.setItem('healthcare_jwt', 'valid-token');
    localStorage.setItem('user_role', 'patient');
    localStorage.setItem('user_name', 'valid-name');
    expect(localStorage.length).toEqual(3)
    service.logout();
    expect(localStorage.length).toEqual(0)
  })
});
