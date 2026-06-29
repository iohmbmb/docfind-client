import {Component, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {LoginRequest} from '../../models/login.types';
import {CommonModule} from '@angular/common';

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

  public onSubmit(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.loginRequest(this.credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        if (this.rememberMe) {
          localStorage.setItem('remember_user_email', this.credentials.email);
        }

        this.router.navigate(['/booking']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Invalid email or password. Please try again.');
        console.error(err);
      }
    });
  }
}
