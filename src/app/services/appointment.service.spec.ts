import { TestBed } from '@angular/core/testing';
import { AppointmentService } from './appointment.service';
import {Appointments} from '../models/appointment.types';
import {of} from 'rxjs';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {environment} from '../../environments/environment.development';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()]
    });
    service = TestBed.inject(AppointmentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get appointments for user', () =>{
    const appointments : Appointments[] = [];
    service.getAppointmentsFor('valid-id').subscribe(res => {
      expect(res).toEqual(appointments);
    })
    const req = httpTestingController.expectOne(`${environment.apiUrl}/get/user/valid-id/appointments`);
    expect(req.request.method).toBe('GET');
    req.flush(appointments);
  })

  it('should create an appointment', () =>{
    const appointment : Appointments = {
      id:'valid-id',
      patientId: 'valid-patient-id',
      doctorId: 'valid-doctor-id',
      scheduleTime: new Date(),
    }
    service.createAppointment(appointment).subscribe(res => {
      expect(res).toEqual(appointment);
    });
    const req = httpTestingController.expectOne(`${environment.apiUrl}/create/appointment`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(appointment);
    req.flush(appointment);
  })
});
