import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {DoctorRegisterRequest, UserRegisterRequest} from '@shared/models/register.types';
import {User, UserRole} from '@shared/models/user.types';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {environment} from '../../environments/environment.development';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {Identity} from '@shared/models/identity.types';
import {LoginRequest, LoginResponse} from '@shared/models/login.types';
import {PasswordRequest} from '@shared/models/password-request.types';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClientTesting()]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() =>{
    httpMock.verify();
    localStorage.clear();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () =>{
    const mockRegister : UserRegisterRequest = {
      email: 'legit-mail', password: 'secure-password',
      firstName: 'joe', lastName: 'jone', role: UserRole.patient};

    const mockResponse = {
      id: 'user-xyz-999',
      email: 'legit-mail',
      firstName: 'joe',
      lastName: 'jone',
      role: UserRole.patient,
      createdAt: '2026-09-01T12:00:00Z'
    };

    service.registerUser(mockRegister).subscribe((resp) =>{
      expect(resp).toEqual(mockResponse);
    })
    const expectedUrl = `${environment.apiUrl}/auth/register`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegister);
    req.flush(mockResponse);
  })

  it('should register a doctor', () =>{

    const mockRegister : DoctorRegisterRequest = {
      email: 'legit-mail', password: 'secure-password',
      firstName: 'joe', lastName: 'jone',
      role: UserRole.doctor, practiceName: 'practice',
      practiceAddress: 'address', practiceSuburb: 'suburbs',
      practiceState: 'state', practicePostcode: 'postcode',
      practicePhone:'9283839302', hourlyRate: 20,
      specialty: PracticeSpecialty.GeneralPractice,
      longitude: 2.33, latitude: 1.09
    };

    const mockResponse = {
      id: 'doctor-xyz-999',
      email: 'legit-mail', password: 'secure-password',
      firstName: 'joe', lastName: 'jone',
      role: UserRole.doctor, practiceName: 'practice',
      practiceAddress: 'address', practiceSuburb: 'suburbs',
      practiceState: 'state', practicePostcode: 'postcode',
      practicePhone:'9283839302', hourlyRate: 20,
      specialty: PracticeSpecialty.GeneralPractice,
      longitude: 2.33, latitude: 1.09,
      createdAt: '2026-09-01T12:00:00Z'
    };

    service.registerDoctor(mockRegister).subscribe((resp) =>{
      expect(resp).toEqual(mockResponse);
    })
    const expectedUrl = `${environment.apiUrl}/auth/register`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegister);
    req.flush(mockResponse);
  })

  it('should get the identity of the user', () =>{
    const mockIdentity : Identity = {id:"legit-identity"};
    service.getId().subscribe((resp) =>{
      expect(resp).toEqual(mockIdentity);
    })
    const expectedUrl = `${environment.apiUrl}/auth/me`;
    const req = httpMock.expectOne(expectedUrl);
    req.flush(mockIdentity)
  })

  it('should login a user', () =>{
    const mockUser : User = {
      id:'valid-id', email:'valid-mail',
      passwordHash:'super-password', firstName:'joe',
      lastName: 'jones', role: UserRole.patient
    };
    const mockLogin : LoginRequest = {
      email: 'legit-mail', password: 'secure-password'
    };
    const mockResp : LoginResponse = {
      token: 'legit-token', user: mockUser
    };
    service.loginRequest(mockLogin).subscribe((resp) =>{
      expect(resp).toEqual(mockResp);
    });
    const expectedUrl = `${environment.apiUrl}/auth/login`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLogin);
    req.flush(mockResp);
  })

  it('should update the password', () =>{
    const mockPassReq : PasswordRequest = {
      currentPassword:'weak-password',
      newPassword:'strong-password'
    };
    service.updatePassword(mockPassReq).subscribe((req) =>{
      expect(req).toEqual(mockPassReq);
    });
    const expectedUrl = `${environment.apiUrl}/auth/update/password`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPassReq);
  })

  it('should set the session', () =>{
    expect(service.isAuthenticated()).toBeFalsy();
    const mockUser : User = {
      id:'valid-id', email:'valid-mail',
      passwordHash:'super-password', firstName:'joe',
      lastName: 'jones', role: UserRole.patient
    };
    const mockResp : LoginResponse = {
      token: 'legit-token', user: mockUser
    };
    service.setSession(mockResp);
    expect(localStorage.getItem('healthcare_jwt')).toBe('legit-token');
    expect(localStorage.getItem('user_role')).toBe('0');
    expect(localStorage.getItem('user_name')).toBe(mockUser.firstName);
    expect(service.isAuthenticated()).toBeTruthy();

    localStorage.clear();

    const mockUserNoRole : User = {
      id:'valid-id', email:'valid-mail',
      passwordHash:'super-password', firstName:'joe',
      lastName: 'jones', role: undefined
    };
    const mockRespNoRole : LoginResponse = {
      token: 'legit-token', user: mockUserNoRole
    };
    service.setSession(mockRespNoRole);
    expect(localStorage.getItem('user_role')).toBe(null);
  })

  it('should clear the session', () =>{
    const mockUser : User = {
      id:'valid-id', email:'valid-mail',
      passwordHash:'super-password', firstName:'joe',
      lastName: 'jones', role: UserRole.patient
    };
    const mockResp : LoginResponse = {
      token: 'legit-token', user: mockUser
    };
    service.setSession(mockResp);
    expect(service.isAuthenticated()).toBeTruthy();
    service.logout();
    expect(service.isAuthenticated()).toBeFalsy();
    expect(localStorage.length).toEqual(0);
  })

});
