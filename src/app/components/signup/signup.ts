import {Component, computed, inject, signal} from '@angular/core';
import {form, FormField, pattern, required, submit} from '@angular/forms/signals';
import {FormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {UserRole} from '../../models/user.types';
import {firstValueFrom} from 'rxjs';
import {UserRegisterRequest} from '@shared/models/register.types';

@Component({
  selector: 'app-signup',
  imports: [FormField, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignupComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  public signupModel = signal<UserRegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: UserRole.patient,
  });

  public rememberMe = false;

  public errorMessage = signal<string>('')
  public isLoading = signal<boolean>(false);

  public signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    required(schemaPath.password, { message: 'Password is required' });
    required(schemaPath.firstName, { message: 'First name is required' });
    required(schemaPath.lastName, { message: 'Last name is required' });

    pattern(schemaPath.email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      { message: 'Please enter a valid email address (e.g. example@example.com)' });

    pattern(
      schemaPath.password,
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: 'Password does not meet the necessary complexity requirements.' }
    );
  })

  public passwordRules = computed(() => {
    // Read the current text out of your form model signal
    const currentPassword = this.signupModel().password;

    return {
      hasMinLength: currentPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(currentPassword),
      hasLowercase: /[a-z]/.test(currentPassword),
      hasNumber: /\d/.test(currentPassword),
      hasSymbol: /[@$!%*?&]/.test(currentPassword)
    };
  });

  public onSubmit(): void {
    this.errorMessage.set('');

    submit(this.signupForm, async () => {
      this.isLoading.set(true);
      const registrationPayload = this.signupModel();
      if (this.rememberMe) {
        localStorage.setItem('remember_user_email', registrationPayload.email);
      }

      try {
        await firstValueFrom(this.authService.registerUser(registrationPayload));

        this.isLoading.set(false);
        await this.router.navigate(['/bookings']);
      }
      catch (err) {
        this.isLoading.set(false);
        this.errorMessage.set('User already exists or registration rejected.');
        console.error(err);
      }
    });
  }
}
