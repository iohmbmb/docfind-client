import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {environment} from '../../../../../../src/environments/environment.development';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data', async () =>{
    const req = httpTestingController.expectOne(`${environment.apiUrl}/get/user/8fb99128-de23-4463-818b-9e883de63a1c/appointments`);
    expect(req.request.method).toBe('GET');

    const mockAppointments = [{ id: 1, name: 'Checkup' }];
    req.flush(mockAppointments);

    await fixture.whenStable();

    expect(component.pageData).toEqual(mockAppointments);
    expect(component.isLoading()).toEqual(false);
  });


  it('should catch an error', async () =>{
    const req = httpTestingController.expectOne(`${environment.apiUrl}/get/user/8fb99128-de23-4463-818b-9e883de63a1c/appointments`);
    expect(req.request.method).toBe('GET');

    const mockAppointments = [{ id: 1, name: 'Checkup' }];
    req.error(new ErrorEvent('Error'), { status: 404 });

    await fixture.whenStable();

    expect(component.pageData).not.toEqual(mockAppointments);
    expect(component.isLoading()).toEqual(false);
    expect(component.errorMessage).toEqual('No appointments');
  });

  it('should display error message', async () => {
    const req = httpTestingController.expectOne(`${environment.apiUrl}/get/user/8fb99128-de23-4463-818b-9e883de63a1c/appointments`);
    expect(req.request.method).toBe('GET');

    const mockAppointments = [{ id: 1, name: 'Checkup' }];
    req.error(new ErrorEvent('Error'), { status: 404 });

    await fixture.whenStable();

    fixture.detectChanges();

    let errorElement = fixture.nativeElement.querySelector('[data-testid="error-msg"]');
    expect(component.isLoading()).toEqual(false);
    expect(errorElement).toBeTruthy();
  })

  it('should display template if data', async () =>{
    const req = httpTestingController.expectOne(`${environment.apiUrl}/get/user/8fb99128-de23-4463-818b-9e883de63a1c/appointments`);
    expect(req.request.method).toBe('GET');

    const mockAppointments = [{ id: 1, name: 'Checkup' }];
    req.flush(mockAppointments);

    await fixture.whenStable();

    fixture.detectChanges();

    const appointmentCard = fixture.nativeElement.querySelector('[data-testid="template"]');
    expect(appointmentCard).toBeTruthy();
  })
});
