import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UnavailabilityPeriod} from '@shared/models/unavailability-period.types';
import {environment} from '../../environments/environment.development';
import {DoctorWorkHours} from '@shared/models/doctor-work.hours';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private http: HttpClient) {}

  getWorkHours(docId:string): Observable<DoctorWorkHours[]>{
    return this.http.get<DoctorWorkHours[]>(`${environment.apiUrl}/schedule/get/${docId}/workhours`);
  }

  getAbsence(docId:string): Observable<UnavailabilityPeriod>{
    return this.http.get<UnavailabilityPeriod>(`${environment.apiUrl}/schedule/get/${docId}/absence`);
  }

  createUpdateWorkHours(docId:string, hours:DoctorWorkHours[]): Observable<any>{
    return this.http.post(`${environment.apiUrl}/schedule/post/${docId}/workhours`, hours);
  }

  createUpdateAbsence(docId:string, period:UnavailabilityPeriod): Observable<any>{
    return this.http.post(`${environment.apiUrl}/schedule/post/${docId}/absence`, period);
  }
}
