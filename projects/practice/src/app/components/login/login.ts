import {Component, inject, signal} from '@angular/core';
import {AuthService} from '@shared/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {LoginRequest} from '@shared/models/login.types';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public credentials: LoginRequest = { email: '', password: ''};

  public errorMessage = signal<string>('')
  public isLoading = signal<boolean>(false);

  public onSubmit(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.loginRequest(this.credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Invalid email or password. Please try again.');
        console.error(err);
      }
    });
  }
}
