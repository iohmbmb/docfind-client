import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import {Appointments} from '../models/appointment.types';
import { Observable } from 'rxjs';
import {MedicalRecord} from '../models/record.types';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  getAppointmentsFor(userId: string): Observable<Appointments[]> {
    return this.http.get<Appointments[]>(`${environment.apiUrl}/get/user/${userId}/appointments`);
  }

  getRecordsFor(appointmentId: string): Observable<Appointments[]> {
    return this.http.get<Appointments[]>(`${environment.apiUrl}/get/record/${appointmentId}`);
  }

  createAppointment(appointment: Appointments): Observable<any> {
    return this.http.post(`${environment.apiUrl}/create/appointment`, appointment);
  }

  createRecord(record: MedicalRecord): Observable<any> {
    return this.http.post(`${environment.apiUrl}/create/record`, record);
  }

  updateAppointment(appointmentId: string, appointment: Appointments): Observable<any> {
    return this.http.put(`${environment.apiUrl}/update/appointment/${appointmentId}`, appointment);
  }

  updateRecord(recordId: string, record: MedicalRecord): Observable<any> {
    return this.http.put(`${environment.apiUrl}/update/record/${recordId}`, record);
  }

  deleteAppointment(appointmentId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/delete/appointment/${appointmentId}`);
  }

  deleteRecord(recordId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/delete/record/${recordId}`);
  }
}
