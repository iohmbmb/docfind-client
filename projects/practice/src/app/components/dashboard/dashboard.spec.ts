import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
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
    updateAppointment: ReturnType<typeof vi.fn>;
    deleteAppointment: ReturnType<typeof vi.fn>;
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
      getAppointmentsFor: vi.fn(),
      updateAppointment: vi.fn(),
      deleteAppointment: vi.fn()
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
    const today = new Date();
    today.setHours(10, 0, 0);
    mockAppointmentService.getAppointmentsFor.mockReturnValue(of([{id: 'valid-id', consultationType:'CheckUp', scheduleTime: today, status: AppointmentStatus.Pending}]))
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
  });

  it('should display template if data', async () =>{
    component.dashboardInfos.set([{ appointmentId: '228993', name:'Bart', email: 'mail@mail.com', visitType: 'CheckUp', date: new Date(), status: AppointmentStatus.Pending }]);
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 20));
    let appointmentCard = fixture.nativeElement.querySelector('[data-testid="template"]');
    expect(appointmentCard).toBeTruthy();
  });

  it('should confirm appointment', async () => {
    const spyOnConfirm = vi.spyOn(component, 'onConfirm');
    component.appointments = [
      {id: '1', patientId: '1', doctorId: '2', scheduleTime: new Date(), status: AppointmentStatus.Pending},
      {id: '2', patientId: '2', doctorId: '2', scheduleTime: new Date(), status: AppointmentStatus.Pending},
      {id: '3', patientId: '4', doctorId: '2', scheduleTime: new Date(), status: AppointmentStatus.Pending},
    ];
    const info = {appointmentId: '1', name: 'Paul', email:'valid-mail', visitType:'valid-type', date: new Date(), status: AppointmentStatus.Pending};
    mockAppointmentService.updateAppointment.mockReturnValue(of({}));
    await component.onConfirm(info);
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(spyOnConfirm).toHaveBeenCalledWith(info);
    expect(info.status).toBe(AppointmentStatus.Confirmed);
    expect(component.appointments[0].status).toBe(AppointmentStatus.Confirmed);
  })

  it('should cancel appointment', async () => {
    const spyOnCancel = vi.spyOn(component, 'onCancel');
    component.appointments = [
      {id: '1', patientId: '1', doctorId: '2', scheduleTime: new Date(), status: AppointmentStatus.Pending},
      {id: '2', patientId: '2', doctorId: '2', scheduleTime: new Date(), status: AppointmentStatus.Pending},
      {id: '3', patientId: '4', doctorId: '2', scheduleTime: new Date(), status: AppointmentStatus.Pending},
    ];
    const info = {appointmentId: '1', name: 'Paul', email:'valid-mail', visitType:'valid-type', date: new Date(), status: AppointmentStatus.Pending};
    mockAppointmentService.updateAppointment.mockReturnValue(of({}));
    await component.onCancel(info);
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(spyOnCancel).toHaveBeenCalledWith(info);
    expect(info.status).toBe(AppointmentStatus.Cancelled);
    expect(component.appointments[0].status).toBe(AppointmentStatus.Cancelled);
  })

  it('should delete appointment', async () => {
    const spyOnDelete = vi.spyOn(component, 'onDelete');
    component.appointments = [
      {id: '1', patientId: '1', doctorId: '2', scheduleTime: new Date(), status: AppointmentStatus.Pending},
      {id: '2', patientId: '2', doctorId: '2', scheduleTime: new Date(), status: AppointmentStatus.Pending},
      {id: '3', patientId: '4', doctorId: '2', scheduleTime: new Date(), status: AppointmentStatus.Pending},
    ];
    component.dashboardInfos.set([
      { appointmentId: '2', name:'Bart', email: 'mail@mail.com', visitType: 'CheckUp', date: new Date(), status: AppointmentStatus.Pending },
      { appointmentId: '1', name:'Paul', email: 'valid-mail', visitType: 'valid-type', date: new Date(), status: AppointmentStatus.Pending }
    ]);
    const info = component.dashboardInfos()[1];
    mockAppointmentService.deleteAppointment.mockReturnValue(of({}));
    expect(component.dashboardInfos().length).toBe(2);
    await component.onDelete(info);
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(spyOnDelete).toHaveBeenCalledWith(info);
    expect(component.dashboardInfos().length).toBe(1);
  })

  it('should filter appointment by a filter', async () => {
    await new Promise(resolve => setTimeout(resolve, 20));
  })

});
