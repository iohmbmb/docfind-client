import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {LoginRequest} from '../../models/login.types';
import {CommonModule} from '@angular/common';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public credentials: LoginRequest = { email: '', password: ''};
  public rememberMe = false;

  public errorMessage = signal<string>('')
  public isLoading = signal<boolean>(false);

  public async onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const response = await firstValueFrom(this.authService.loginRequest(this.credentials));
      const me = await firstValueFrom(this.authService.getId())
      if(response){
        this.isLoading.set(false);
        if (this.rememberMe) {
          localStorage.setItem('remember_user_email', this.credentials.email);
        }
        this.router.navigate(['/bookings']);
      }
      localStorage.setItem('user_id', me.id);
    }
    catch (err) {
      this.isLoading.set(false);
      this.errorMessage.set('Invalid email or password. Please try again.');
      console.error(err);
    }
  }
}
