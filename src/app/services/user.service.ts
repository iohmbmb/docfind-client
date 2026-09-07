import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import {User} from '../models/user.types';
import { Observable } from 'rxjs';
import {Doctor} from '../models/doctor.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/get/users`);
  }

  getDoctor(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${environment.apiUrl}/get/doctor/${id}`);
  }

  updateDoctor(id: string, updatedDoctor:Doctor): Observable<any> {
    return this.http.put(`${environment.apiUrl}/update/doctor/${id}`, updatedDoctor);
  }
}
