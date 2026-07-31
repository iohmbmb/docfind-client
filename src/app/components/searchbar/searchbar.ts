import {Component, computed, inject, input, Input, signal, Signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {MapboxService} from '@shared/services/mapbox.service';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatInput} from '@angular/material/input';
import {form, FormField, submit} from '@angular/forms/signals';
import {debounceTime, distinctUntilChanged, firstValueFrom, Observable, of, Subject, switchMap} from 'rxjs';
import {SearchService} from '@shared/services/search.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Doctor} from '@shared/models/doctor.types';

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
    MatProgressSpinner
  ],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css',
})
export class SearchComponent {

  constructor(private route: ActivatedRoute) {}

  showShadow = input(true);
  private mapBoxService = inject(MapboxService)
  private router = inject(Router)
  searchService = inject(SearchService)
  specialties = Object.values(PracticeSpecialty)
  doctors = signal<Doctor[]>([]);
  isLoading = signal<boolean>(false);
  isError = signal<boolean>(false);
  locations = signal<any[]>([]);
  searchSubject = new Subject<string>();
  errorMessage = signal<string>('')
  showSpecialties = signal<boolean>(false);

  searchModel = signal({
    specialty: '',
    address: '',
    longitude: 0,
    latitude: 0
  })

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) {
          return of({ features: [] });
        }
        return this.mapBoxService.queryPlaceAndLocality(value);
      })
    ).subscribe(result => {
      this.locations.set(result.features);
    });

    this.route.queryParams.subscribe(params => {
      if (
        params['specialty'] &&
        params['longitude'] &&
        params['latitude']
      ) {
        this.searchModel.update(model => ({
          ...model,
          specialty: params['specialty'],
          address: params['address']
        }))
        this.executeSearch(
          params['specialty'],
          Number(params['longitude']),
          Number(params['latitude'])
        );
      }
    });
  }

  ngAfterViewInit() {
    feather.replace();
  }

  searchForm = form(this.searchModel)

  onLocationInput(value: string){
    this.searchSubject.next(value);
  }

  selectLocation(feature: any){
    const context = feature.properties.context;
    this.searchModel.update(model => ({
      ...model,
      address: context.place?.name ?? '',
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1]
    }))
  }

  search() {
    submit(this.searchForm, async () => {
      const model = this.searchModel();

      this.router.navigate(['/search'], {
        queryParams: {
          specialty: model.specialty,
          address: model.address,
          longitude: model.longitude,
          latitude: model.latitude
        }
      });
    });
  }

  async executeSearch(
    specialty: PracticeSpecialty,
    longitude: number,
    latitude: number
  ) {
    this.isLoading.set(true);
    this.isError.set(false);

    try {
      const doctors = await firstValueFrom(
        this.searchService.getDoctors(
          specialty,
          longitude,
          latitude
        )
      );

      this.doctors.set(doctors);
    } catch (err) {
      this.errorMessage.set("No doctors found.");
      this.isError.set(true);
    } finally {
      setTimeout(() => {
        this.isLoading.set(false);
      }, 1000);
    }
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
      this.formatSpecialty(specialty)
        .toLowerCase()
        .includes(value)
    );
  });

  hideSpecialties() {
    setTimeout(() => {
      this.showSpecialties.set(false);
    }, 150);
  }

  formatSpecialty(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').trim();
  }

  book(doctor: any){
    this.router.navigate(['/booking'], {
      state: {
        doctor: doctor
      }
    })
  }
}
