import {Component, computed, DestroyRef, inject, input, Input, signal, Signal, WritableSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {MapboxService} from '@shared/services/mapbox.service';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatInput} from '@angular/material/input';
import {form, FormField, submit} from '@angular/forms/signals';
import {async, debounceTime, distinctUntilChanged, firstValueFrom, of, Subject, switchMap} from 'rxjs';
import {SearchService} from '@shared/services/search.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {Doctor} from '@shared/models/doctor.types';
import {BookingStateService} from '@shared/services/booking-state-service';
import {ScheduleService} from '@shared/services/schedule';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DoctorWorkHours} from '@shared/models/doctor-work.hours';
import {DatePipe} from '@angular/common';
import {Utils} from '@shared/services/utils';
import {SearchStateService} from '@shared/services/search-state-service';

declare var feather: any

@Component({
  selector: 'app-searchbar',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatInput,
    MatAutocomplete,
    MatOption,
    FormField,
    FormsModule,
    MatProgressSpinner,
  ],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css',
})

export class SearchComponent {

  private readonly DOCTOR_KEY = 'booking_doctor_state';
  private scheduleService = inject(ScheduleService);
  private bookingStateService = inject(BookingStateService);

  state = inject(SearchStateService);
  showShadow = input(true);
  specialties = Object.values(PracticeSpecialty)
  searchSubject = new Subject<string>();
  showSpecialties = signal<boolean>(false);
  searchForm = form(this.state.getSearchSignal());

  constructor(private router: Router, private route: ActivatedRoute, public utils: Utils) {}

  ngOnInit() {
    this.state.getLocationWith(this.searchSubject);
    this.state.executeSearchOn(this.route)
  }

  ngAfterViewInit() {
    feather.replace();
  }

  ngOnDestroy() {
    this.state.clearSearchState();
    this.searchForm.address().value.set('');
    this.searchForm.specialty().value.set('');
  }

  onLocationInput(value: string){
    this.searchSubject.next(value);
  }

  selectLocation(feature: any){
    const context = feature?.properties?.context;
    this.state.updateSearchModel(({
      address: context?.place?.name ?? '',
      longitude: feature?.geometry?.coordinates[0],
      latitude: feature?.geometry?.coordinates[1]
    }))
  }

  search() {
    submit(this.searchForm, async () => {
      await this.router.navigate(['/search'], {
        queryParams: {
          specialty: this.state.getSearchModel().specialty,
          address: this.state.getSearchModel().address,
          longitude: this.state.getSearchModel().longitude,
          latitude: this.state.getSearchModel().latitude
        }
      });
    });
  }

  selectSpecialty(specialty: string) {
    this.searchForm.specialty().value.set(specialty);
    this.showSpecialties.set(false);
  }

  filteredSpecialties = computed(() => {
    const value = this.searchForm.specialty().value()?.toLowerCase() ?? '';
    if (!value) {
      return this.specialties;
    }
    return this.specialties.filter(specialty =>
      this.utils.formatSpecialty(specialty)
        .toLowerCase()
        .includes(value)
    );
  });

  hideSpecialties() {
    setTimeout(() => {
      this.showSpecialties.set(false);
    }, 150);
  }

  async book(docId: string){
    let doctor = this.state.getDoctors().find(doc => doc.id == docId);
    if(doctor != undefined) {
      this.bookingStateService.updateDoctorModel(({
        id: doctor.id,
        email: doctor.email,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        practiceName: doctor.practiceName,
        practiceAddress: doctor.practiceAddress,
        practiceSuburb: doctor.practiceSuburb,
        practiceState: doctor.practiceState,
        practicePostcode: doctor.practicePostcode,
        practicePhone: doctor.practicePhone,
        hourlyRate: doctor.hourlyRate,
        status: doctor.status,
        preference: doctor.preference,
        specialty: doctor.specialty,
        consultationType: doctor.consultationType
      }))
      const workHours = await firstValueFrom(this.scheduleService.getWorkHours(doctor.id!))
      this.bookingStateService.updateDoctorWorkHours(workHours)
      localStorage.setItem(this.DOCTOR_KEY, JSON.stringify(this.bookingStateService.getDoctorModel()));
      this.router.navigate(['/booking'])
    }
  }
}
