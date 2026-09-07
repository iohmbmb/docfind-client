import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {UserRegisterRequest} from '@shared/models/register.types';
import {UserRole} from '@shared/models/user.types';

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

    service.
  })
});
