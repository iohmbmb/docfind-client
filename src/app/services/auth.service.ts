import {Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import {Observable, tap} from 'rxjs';
import {Identity} from '../models/identity.types';
import {LoginRequest, LoginResponse} from '../models/login.types';
import {DoctorRegisterRequest, UserRegisterRequest} from '@shared/models/register.types';
import {Doctor} from '@shared/models/doctor.types';
import {PasswordRequest} from '@shared/models/password-request.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public isAuthenticated = signal<boolean>(!!localStorage.getItem('healthcare_jwt'));

  constructor(private http: HttpClient) {}

  registerUser(request: UserRegisterRequest) {
    return this.http.post(`${environment.apiUrl}/auth/register`, request);
  }

  registerDoctor(request: DoctorRegisterRequest) {
    return this.http.post(`${environment.apiUrl}/auth/register`, request);
  }

  getId(): Observable<Identity> {
    return this.http.get<Identity>(`${environment.apiUrl}/auth/me`);
  }

  loginRequest(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((response: LoginResponse) => {
        this.setSession(response);
      })
    );
  }

  updatePassword(request: PasswordRequest): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/update/password`, request);
  }

  setSession(response: LoginResponse): void {
    localStorage.setItem('healthcare_jwt', response.token);
    if(response.user.role != undefined){
      localStorage.setItem('user_role', response.user.role.toString());
    }
    localStorage.setItem('user_name', response.user.firstName);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.clear();
    this.isAuthenticated.set(false);
  }
}
