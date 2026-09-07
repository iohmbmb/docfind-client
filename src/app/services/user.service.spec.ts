import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {User, UserRole} from '@shared/models/user.types';
import { Doctor } from "@shared/models/doctor.types";
import {environment} from '../../environments/environment.development';
import {Availability} from '@shared/models/availability';
import {LocationPreference} from '@shared/models/location-preference';
import {PracticeSpecialty} from '@shared/models/practice-specialty';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', () => {
    const users : User[] = [
      {
        id: 'valid-id',
        email: 'valid-email',
        passwordHash: 'valid-password',
        firstName: 'valid-firstname',
        lastName: 'valid-lastname',
        role: UserRole.patient,
      }
    ];

    service.getUsers().subscribe(res => {
      expect(res).toEqual(users);
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/get/users`);
    expect(request.request.method).toBe('GET');
    request.flush(users);
  });

  it('should get doctor by id', () => {
    const doctor : Doctor =
      {
        id: 'valid-id',
        email: 'valid-email',
        passwordHash: 'valid-password',
        firstName: 'valid-firstname',
        lastName: 'valid-lastname',
        practiceName: 'valid-practice',
        practiceAddress: 'valid-address',
        practiceSuburb: 'valid-suburb',
        practiceState: 'valid-state',
        practicePostcode: 'valid-postcode',
        practicePhone: 'valid-phone',
        hourlyRate: 20,
        status: Availability.Available,
        preference: LocationPreference.InPerson,
        specialty: PracticeSpecialty.GeneralPractice,
        role: UserRole.doctor,
      };

    service.getDoctor('valid-id').subscribe(res => {
      expect(res).toEqual(doctor);
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/get/doctor/valid-id`);
    expect(request.request.method).toBe('GET');
    request.flush(doctor);
  });

  it('should update doctor', () => {
    const updatedDoctor : Doctor =
      {
        id: 'valid-id',
        email: 'valid-email',
        passwordHash: 'valid-password',
        firstName: 'valid-firstname',
        lastName: 'valid-lastname',
        practiceName: 'valid-practice',
        practiceAddress: 'valid-address',
        practiceSuburb: 'valid-suburb',
        practiceState: 'valid-state',
        practicePostcode: 'valid-postcode',
        practicePhone: 'valid-phone',
        hourlyRate: 20,
        status: Availability.Available,
        preference: LocationPreference.InPerson,
        specialty: PracticeSpecialty.GeneralPractice,
        role: UserRole.doctor,
      };

    service.updateDoctor('valid-id', updatedDoctor).subscribe(res => {
      expect(res).toEqual(updatedDoctor);
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/update/doctor/valid-id`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updatedDoctor);
    request.flush(updatedDoctor);
  });

});
