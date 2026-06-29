import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
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

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${environment.apiUrl}/get/doctors`);
  }

  getDoctorsBy(specialty: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${environment.apiUrl}/get/doctors/${specialty}`);
  }

  deleteUsers(id: string): Observable<User[]> {
    return this.http.delete<User[]>(`${environment.apiUrl}/delete/user/${id}`);
  }
}
