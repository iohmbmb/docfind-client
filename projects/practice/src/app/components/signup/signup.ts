import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DoctorRegisterRequest} from '@shared/models/register.types';
import {form, FormField, pattern, required, submit} from '@angular/forms/signals';
import {UserRole} from '@shared/models/user.types';
import {Router, RouterLink} from '@angular/router';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {Availability} from '@shared/models/availability';
import {LocationPreference} from '@shared/models/location-preference';
import {debounceTime, distinctUntilChanged, firstValueFrom, of, Subject, switchMap} from 'rxjs';
import {AuthService} from '@shared/services/auth.service';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MapboxService} from '@shared/services/mapbox.service';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    FormField,
    RouterLink,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatInput
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  host: {
    class: 'flex-1 flex flex-col w-full'
  }
})
export class SignupComponent {
  private authService = inject(AuthService);
  private mapboxService = inject(MapboxService);
  private router = inject(Router);

  specialties = Object.values(PracticeSpecialty);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  private searchSubject = new Subject<string>();
  locations = signal<any[]>([]);

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) {
          return of({ features: [] });
        }
        return this.mapboxService.queryAddress(value);
      })
    ).subscribe(result => {
        this.locations.set(result.features);
      });
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
    preference: LocationPreference.Hybrid,
    longitude: 0.0,
    latitude: 0.0

  });

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

  onAddressInput(value: string) {
    this.searchSubject.next(value);
  }

  selectAddress(feature: any) {
    const context = feature.properties.context;

    this.signupModel.update(model => ({
      ...model,
      practiceAddress: feature.properties.name,
      practiceSuburb: context.place?.name ?? '',
      practiceState: context.region?.name ?? '',
      practicePostcode: context.postcode?.name ?? '',
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1]
    }));
  }

  public registerDoctor(){
    this.errorMessage.set('');
    submit(this.signupForm, async () => {
      this.isLoading.set(true);
      try {
        await firstValueFrom(this.authService.registerDoctor(this.signupModel()));
        await this.router.navigate(['/login']);
      }
      catch (err) {
        this.errorMessage.set('User already exists or registration rejected.');
        console.error(err);
      }
      finally {
        this.isLoading.set(false);
      }
    });
  }

  formatSpecialty(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').trim();
  }
}
