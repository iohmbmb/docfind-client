import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers :[
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpTestingController.verify();
  })

  it('should add the Authorization header if a token exists', () =>{
    localStorage.setItem('healthcare_jwt', 'fake-valid-token');
    httpClient.get('/api/dashboard').subscribe();
    const req = httpTestingController.expectOne('/api/dashboard');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-valid-token');
    req.flush({});
  })

  it('should forward the request', () => {
    const mockData = { status: 'success', data: 'healthcare-dashboard-info' };
    httpClient.get('/api/data').subscribe((response) => {
      expect(response).toEqual(mockData);
    });
    const req = httpTestingController.expectOne('/api/data');
    req.flush(mockData);
  });
});
