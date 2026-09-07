import { TestBed } from '@angular/core/testing';

import { MapboxService } from './mapbox.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {environment} from '../../environments/environment.development';

describe('MapboxService', () => {
  let service: MapboxService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(MapboxService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should query address', () =>{
    const mockResponse = {};
    const searchAddress = 'valid-address';
    service.queryAddress(searchAddress).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const request = httpTestingController.expectOne(`${environment.mapBoxAPI}/forward?q=${encodeURIComponent(searchAddress)}&autocomplete=true&limit=5&types=address&proximity=ip&access_token=${environment.mapBoxToken}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('should query place and location', () =>{
    const mockResponse = {};
    const searchAddress = 'valid-address';
    service.queryPlaceAndLocality(searchAddress).subscribe(res => {
      expect(res).toEqual(mockResponse);
    })
    const request = httpTestingController.expectOne(`${environment.mapBoxAPI}/forward?q=${encodeURIComponent(searchAddress)}&autocomplete=true&limit=5&types=place%2Clocality&proximity=ip&access_token=${environment.mapBoxToken}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });
});
