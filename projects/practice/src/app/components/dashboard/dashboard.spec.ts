import {ComponentFixture, TestBed} from '@angular/core/testing';
import { Dashboard } from './dashboard';
import {of} from 'rxjs';
import {AuthService} from '@shared/services/auth.service';
import {AppointmentStatus} from '@shared/models/appointment.types';
import {UserService} from "@shared/services/user.service";
import {AppointmentService} from '@shared/services/appointment.service';


declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let mockAuthService: {
    getId: ReturnType<typeof vi.fn>;
  }
  let mockUserService: {
    getUser: ReturnType<typeof vi.fn>;
  }
  let mockAppointmentService: {
    getAppointmentsFor: ReturnType<typeof vi.fn>;
  }

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    }
    mockAuthService = {
      getId: vi.fn()
    }
    mockUserService = {
      getUser: vi.fn()
    }
    mockAppointmentService = {
      getAppointmentsFor: vi.fn()
    }
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: AppointmentService, useValue: mockAppointmentService}]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    window.feather = undefined;
    if (fixture) {
      fixture.destroy();
    }
  })

  it('should create', async () => {
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(component).toBeTruthy();
  });

  it('should have data', async () =>{
    mockAuthService.getId.mockReturnValue(of({ id: '8fb99128-de23-4463-818b-9e883de63a1c' }));
    mockUserService.getUser.mockReturnValue(of({ firstName: 'John', lastName: 'Doe', email: 'mail@mail.com'}));
    //TODO: fix this test
    const today = new Date();
    today.setHours(10, 0, 0);
    mockAppointmentService.getAppointmentsFor.mockReturnValue(of([{consultationType:'CheckUp', date: today.toLocaleString(), status: AppointmentStatus.Pending}]))
    await component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(component.dashboardInfos().length).not.toEqual(0);
    expect(component.isLoading()).toEqual(false);
  });


  it('should catch an error', async () =>{
    await component.ngOnInit();
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(component.dashboardInfos().length).toEqual(0);
    expect(component.isLoading()).toEqual(false);
    expect(component.errorMessage).toEqual('No appointments');
  });

  it('should display error message', async () => {
    await component.ngOnInit();
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 20));
    let errorElement = fixture.nativeElement.querySelector('[data-testid="error-msg"]');
    expect(component.isLoading()).toEqual(false);
    expect(errorElement).toBeTruthy();
  })

  it('should display template if data', async () =>{
    component.dashboardInfos.set([{ appointmentId: '228993', name:'Bart', email: 'mail@mail.com', visitType: 'CheckUp', date: new Date(), status: AppointmentStatus.Pending }]);
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 20));
    let appointmentCard = fixture.nativeElement.querySelector('[data-testid="template"]');
    expect(appointmentCard).toBeTruthy();
  })
});
