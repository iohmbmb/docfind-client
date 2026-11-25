import {DestroyRef, inject, Injectable, signal} from '@angular/core';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {Doctor} from '@shared/models/doctor.types';
import {catchError, debounceTime, distinctUntilChanged, firstValueFrom, of, Subject, switchMap, tap} from 'rxjs';
import {MapboxService} from '@shared/services/mapbox.service';
import {ActivatedRoute,} from '@angular/router';
import {SearchService} from '@shared/services/search.service';
import {ScheduleService} from '@shared/services/schedule';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DoctorWorkHours} from '@shared/models/doctor-work.hours';
import {SearchInfo} from '@shared/models/search-info.types';

type DocInfo = {
  id: string,
  firstname: string,
  lastname: string,
  image: string | undefined,
  practiceAddress: string,
  practiceSuburb: string,
  practiceState: string,
  practicePostcode: string,
  workDays: DoctorWorkHours[],
  isUnavailable: boolean | undefined,
  endUnavailabilityDate: string | null
}

@Injectable({
  providedIn: 'root',
})
export class SearchStateService {

  private mapBoxService = inject(MapboxService)
  private searchService = inject(SearchService)
  private scheduleService = inject(ScheduleService);
  private destroyRef = inject(DestroyRef);
  private locations = signal<any[]>([]);
  private searchModel = signal<SearchInfo>({specialty: '', address: '', longitude: 0, latitude: 0})
  private error : Error | null = null;
  docInfos  = signal<DocInfo[]>([]);
  doctors = signal<Doctor[]>([])
  isLoading = signal<boolean>(false);

  getError(){
    return this.error;
  }

  getLocations(){
    console.log("search locations:", this.locations());
    return this.locations();
  }

  getDoctors(){
    return this.doctors();
  }

  getDocInfos(){
    return this.docInfos();
  }

  getSearchSignal(){
    return this.searchModel
  }

  getSearchModel(){
    return this.searchModel();
  }

  updateSearchModel(patch: Partial<SearchInfo>) {
    this.searchModel.update(model => ({ ...model, ...patch }));
  }

  getLocationWith(searchSubject: Subject<string>) {
    searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) {
          return of({ features: [] });
        }
        return this.mapBoxService.queryPlaceAndLocality(value);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(result => {
      this.locations.set(result.features);
      console.log("search locations:", this.locations());
    });
  }

  executeSearchOn(route: ActivatedRoute){
    route.queryParams.subscribe(params => {
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

  async executeSearch(
    specialty: PracticeSpecialty,
    longitude: number,
    latitude: number
  ) {
    this.isLoading.set(true);
    try {
      const doctors = await firstValueFrom(
        this.searchService.getDoctors(
          specialty,
          longitude,
          latitude
        ).pipe(
          tap({
            error: (err) => this.error = err
          }),
          catchError(() => of([]))
        )
      );
      const workHoursPromise = Promise.all(doctors.map((doctor) =>
        firstValueFrom(this.scheduleService.getWorkHours(doctor.id!).pipe(
          tap({
            error: (err) => this.error = err
          }),
          catchError(() => of([]))
          )
        )));

      const periodPromise = Promise.all(doctors.map((doctor) =>
        firstValueFrom(this.scheduleService.getAbsence(doctor.id!).pipe(
          tap({
            error: (err) => this.error = err
          }),
          catchError(() => of(null))
          )
        )));

      const [workHours, period] = await Promise.all([
        workHoursPromise,
        periodPromise
      ]);

      this.docInfos.update(model => [
        ...model,
        ...doctors.map((doctor, i) => (
          {
            id : doctor.id!,
            firstname : doctor.firstName,
            lastname : doctor.lastName,
            image: doctor.imagePath,
            practiceAddress : doctor.practiceAddress,
            practiceSuburb : doctor.practiceSuburb,
            practiceState : doctor.practiceState,
            practicePostcode : doctor.practicePostcode,
            workDays : workHours[i],
            isUnavailable : doctor.isUnavailable,
            endUnavailabilityDate : period[i]?.endDate ?? ""
          }))
      ]);

      this.doctors.set(doctors);
    } catch (err) {
      console.error('Error: ', err);
    } finally {
      setTimeout(() => this.isLoading.set(false), 1000)
    }
  }

  clearSearchState(){
    this.locations.update(() => []);
    this.doctors.update(() => []);
    this.docInfos.update(() => []);
  }
}
