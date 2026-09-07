import { TestBed } from '@angular/core/testing';

import { ScheduleService } from './schedule';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {UnavailabilityPeriod} from '@shared/models/unavailability-period.types';
import {environment} from '../../environments/environment.development';
import {DayOfWeek, DoctorWorkHours} from '@shared/models/doctor-work.hours';

describe('Schedule', () => {
  let service: ScheduleService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(ScheduleService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get unavailability period', () => {
    const mockResponse : UnavailabilityPeriod = {
      startDate: 'valid-date',
      endDate: 'valid-date',
    };
    service.getAbsence('valid-doc-id').subscribe(res => {
      expect(res).toBe(mockResponse);
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/schedule/get/valid-doc-id/absence`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('should create / update work hours', () => {
    const mockPayload : DoctorWorkHours[] = [
      {
        day: DayOfWeek.Monday,
        startTime: '08:00',
        endTime: '18:00',
      },
      {
        day: DayOfWeek.Tuesday,
        startTime: '08:00',
        endTime: '18:00',
      }
    ];

    service.createUpdateWorkHours('valid-doc-id', mockPayload).subscribe(res => {
      expect(res).toBe(mockPayload);
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/schedule/post/valid-doc-id/workhours`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(mockPayload);
    request.flush(mockPayload);
  });

  it('should create / update absence', () => {
    const mockPayload : UnavailabilityPeriod = {
      startDate: 'valid-date',
      endDate: 'valid-date',
    };

    service.createUpdateAbsence('valid-doc-id', mockPayload).subscribe(res => {
      expect(res).toBe(mockPayload);
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/schedule/post/valid-doc-id/absence`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(mockPayload);
    request.flush(mockPayload);
  });

});
