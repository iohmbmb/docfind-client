import { TestBed } from '@angular/core/testing';

import { AppointmentService } from './appointment.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {environment} from '../../environments/environment.development';
import {Appointments} from '@shared/models/appointment.types';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppointmentService, provideHttpClientTesting()]
    });
    service = TestBed.inject(AppointmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() =>{
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of appointments', () =>{
    const dummyUserId = 'user123';
    const mockAppointments: Appointments[] = [
      { id: '1', patientId: 'pat-12', doctorId: 'doc-123', scheduleTime: new Date() },
      { id: '2', patientId: 'pat-34', doctorId: 'doc-456', scheduleTime: new Date() },
    ];

    service.getAppointmentsFor(dummyUserId).subscribe((appointments) => {
      expect(appointments.length).toBe(2);
      expect(appointments).toEqual(mockAppointments);
    });

    const expectedUrl = `${environment.apiUrl}/get/user/${dummyUserId}/appointments`;
    const req = httpMock.expectOne(expectedUrl);

    expect(req.request.method).toBe('GET');

    req.flush(mockAppointments);
  })

  it('should create a new appointment', () =>{
    const mockAppointment: Appointments = {
      id: '1', patientId: 'pat-12', doctorId: 'doc-123',
        scheduleTime: new Date() };

    service.createAppointment(mockAppointment).subscribe((appointment) => {
      expect(appointment).toEqual(mockAppointment);
    });

    const expectedUrl = `${environment.apiUrl}/create/appointment`;
    const req = httpMock.expectOne(expectedUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockAppointment);

    req.flush(mockAppointment);
  })

});
