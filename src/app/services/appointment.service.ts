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

  createAppointment(appointment: Appointments): Observable<any> {
    return this.http.post(`${environment.apiUrl}/create/appointment`, appointment);
  }
}
