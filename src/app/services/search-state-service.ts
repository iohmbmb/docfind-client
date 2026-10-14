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

  getError(){
    return this.error;
  }

  getLocations(){
    return this.locations(); // issue here, why it doesn't send back anything
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
          catchError(err => of([])),
        )
      );
      // This is O(n) and bad for performance if we grow
      // TODO: might need to find a better way to do this
      for(let i=0; i < doctors.length; i++){
        const workHours = await firstValueFrom(this.scheduleService.getWorkHours(doctors[i].id!))
        const period = await firstValueFrom(this.scheduleService.getAbsence(doctors[i].id!))
        if(period != null){
          this.docInfos.update(model => [
            ...model,
            {
              id : doctors[i].id!,
              firstname : doctors[i].firstName,
              lastname : doctors[i].lastName,
              image: doctors[i].imagePath,
              practiceAddress : doctors[i].practiceAddress,
              practiceSuburb : doctors[i].practiceSuburb,
              practiceState : doctors[i].practiceState,
              practicePostcode : doctors[i].practicePostcode,
              workDays : workHours,
              isUnavailable : doctors[i].isUnavailable,
              endUnavailabilityDate : period.endDate
            },
          ]);
        }
        else {
          this.docInfos.update(model => [
            ...model,
            {
              id : doctors[i].id!,
              firstname : doctors[i].firstName,
              lastname : doctors[i].lastName,
              image: doctors[i].imagePath,
              practiceAddress : doctors[i].practiceAddress,
              practiceSuburb : doctors[i].practiceSuburb,
              practiceState : doctors[i].practiceState,
              practicePostcode : doctors[i].practicePostcode,
              workDays : workHours,
              isUnavailable : doctors[i].isUnavailable,
              endUnavailabilityDate : ""
            },
          ]);

        }
      }
      this.doctors.set(doctors);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    }
  }
}
