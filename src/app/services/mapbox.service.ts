import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  constructor(private http: HttpClient) {}

  queryAddress(search: string):Observable<any>{
    return this.http.get(
      `${environment.mapBoxAPI}/forward?q=${encodeURIComponent(search)}&autocomplete=true&limit=5&types=address&proximity=ip&access_token=${environment.mapBoxToken}`
    )
  }

  queryPlaceAndLocality(search: string):Observable<any>{
    return this.http.get(
      `${environment.mapBoxAPI}/forward?q=${encodeURIComponent(search)}&autocomplete=true&limit=5&types=place%2Clocality&proximity=ip&access_token=${environment.mapBoxToken}`
    )
  }
}
