import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {Observable, Subject} from 'rxjs';
import {Doctor} from '@shared/models/doctor.types';
import {environment} from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getDoctors(specialty: PracticeSpecialty, longitude: number, latitude: number): Observable<Doctor[]>{
    return this.http.get<Doctor[]>(`${environment.apiUrl}/search/doctor`,
      {
        params: {
          specialty: specialty,
          longitude: longitude,
          latitude: latitude
        }
      });
  }
}
