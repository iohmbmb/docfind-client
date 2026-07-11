import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DoctorRegisterRequest} from '@shared/models/register.types';
import {form, FormField, pattern, required, submit} from '@angular/forms/signals';
import {UserRole} from '@shared/models/user.types';
import {Router, RouterLink} from '@angular/router';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {Availability} from '@shared/models/availability';
import {LocationPreference} from '@shared/models/location-preference';
import {firstValueFrom} from 'rxjs';
import {AuthService} from '@shared/services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    FormField,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public datalist : Array<any> = []
  constructor() {
    this.datalist = [
      {id: 0, name: PracticeSpecialty[PracticeSpecialty.GeneralPractice]},
      {id: 1, name: PracticeSpecialty[PracticeSpecialty.Physiotherapy]},
      {id: 2, name: PracticeSpecialty[PracticeSpecialty.Dentistry]},
      {id: 3, name: PracticeSpecialty[PracticeSpecialty.Radiology]},
      {id: 4, name: PracticeSpecialty[PracticeSpecialty.Podiatry]},
      {id: 5, name: PracticeSpecialty[PracticeSpecialty.Optometry]},
      {id: 6, name: PracticeSpecialty[PracticeSpecialty.Chiropractor]},
      {id: 7, name: PracticeSpecialty[PracticeSpecialty.Osteopathic]},
      {id: 8, name: PracticeSpecialty[PracticeSpecialty.Dietitian]},
      {id: 9, name: PracticeSpecialty[PracticeSpecialty.Nutritionist]},
      {id: 10, name: PracticeSpecialty[PracticeSpecialty.Surgeon]},
      {id: 11, name: PracticeSpecialty[PracticeSpecialty.Cardiology]},
      {id: 12, name: PracticeSpecialty[PracticeSpecialty.Neurology]},
      {id: 13, name: PracticeSpecialty[PracticeSpecialty.Orthopedics]},
      {id: 14, name: PracticeSpecialty[PracticeSpecialty.Pediatrics]},
      {id: 15, name: PracticeSpecialty[PracticeSpecialty.Psychology]},
      {id: 16, name: PracticeSpecialty[PracticeSpecialty.Psychiatry]},
      {id: 17, name: PracticeSpecialty[PracticeSpecialty.Urology]}
    ];
  }

  public signupModel = signal<DoctorRegisterRequest>({
    email : '',
    password: '',
    firstName : '',
    lastName :'',
    role : UserRole.doctor,
    practiceName: '',
    practiceAddress: '',
    practiceSuburb: '',
    practiceState: '',
    practicePostcode: '',
    practicePhone: '',
    biography: '',
    hourlyRate: 0.0,
    specialty: PracticeSpecialty.GeneralPractice,
    status: Availability.Available,
    preference: LocationPreference.Hybrid
  });

  public errorMessage = signal<string>('')
  public isLoading = signal<boolean>(false);

  public signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    required(schemaPath.password, { message: 'Password is required' });
    required(schemaPath.firstName, { message: 'First name is required' });
    required(schemaPath.lastName, { message: 'Last name is required' });
    required(schemaPath.practiceName, { message: 'Practice name is required' });
    required(schemaPath.practiceAddress, { message: 'Address is required' });
    required(schemaPath.practiceSuburb, { message: 'Suburb is required' });
    required(schemaPath.practiceState, { message: 'State is required' });
    required(schemaPath.practicePhone, { message: 'Phone number is required' });
    required(schemaPath.practicePostcode, { message: 'Postcode is required' });
    required(schemaPath.hourlyRate, { message: 'Hourly rate is required' });

    pattern(schemaPath.email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      { message: 'Please enter a valid email address (e.g. example@example.com)' });

    pattern(
      schemaPath.password,
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      { message: 'Password does not meet the necessary complexity requirements.' }
    );
  })

  public registerDoctor(){
    this.errorMessage.set('');

    submit(this.signupForm, async () => {
      this.isLoading.set(true);
      const registrationPayload = this.signupModel();

      try {
        await firstValueFrom(this.authService.registerDoctor(registrationPayload));

        this.isLoading.set(false);
        await this.router.navigate(['/dashboard']);
      }
      catch (err) {
        this.isLoading.set(false);
        this.errorMessage.set('User already exists or registration rejected.');
        console.error(err);
      }
    });
  }
}
