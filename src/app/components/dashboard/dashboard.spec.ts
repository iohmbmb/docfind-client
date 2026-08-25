import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import {provideRouter} from '@angular/router';
import {BookingStateService} from '@shared/services/booking-state-service';
import {AppointmentService} from '@shared/services/appointment.service';
import {UserService} from '@shared/services/user.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAppointmentService: any;
  let mockBookingStateService: any;
  let mockUserStateService: any;
  let tomorrow = new Date(Date.now() + 86400000);
  let yesterday = new Date(Date.now() - 86400000);

  beforeEach(async () => {
    mockBookingStateService = {
      patientId: () => 'patient-123'
    }

    mockAppointmentService = {
      getAppointmentsFor: (id: string) => of([
        { id: 'app-1', patientId: 'patient-123', doctorId: 'doc-1', scheduleTime: tomorrow},
        { id: 'app-1', patientId: 'patient-456', doctorId: 'doc-1', scheduleTime: yesterday}
      ])
    }

    mockUserStateService = {
      getDoctor: (id: string) => of({
        id: 'doc-1', name: 'Dr. Jones' })
    }

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideRouter([]), { provide: BookingStateService, useValue: mockBookingStateService },
        { provide:AppointmentService, useValue: mockAppointmentService
        }, { provide: UserService, useValue: mockUserStateService}]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle conditional and multiply items for past booking', () => {
    component.past_bookings.set([]);
    fixture.detectChanges();

    let containers = fixture.nativeElement.querySelectorAll('[data-testid="container-past-bookings"]');
    expect(containers.length).toBe(0);

    component.past_bookings.set([
      {
        schedule: new Date("December 17, 1995 03:24:00"),
        doctor_name: 'Jean',
        doctor_address: '123 Main St'
      },
      {
        schedule: new Date("May 05, 1996 12:24:00"),
        doctor_name: 'Marie',
        doctor_address: '123 Main St'
      }
    ])
    fixture.detectChanges();

    containers = fixture.nativeElement.querySelectorAll('[data-testid="container-past-bookings"]');
    expect(containers.length).toBe(2)
    expect(containers[0].textContent).toContain('Jean');
    expect(containers[1].textContent).toContain('Marie');
  })

  it('should handle conditional and multiply items for current booking', () => {
    component.current_bookings.set([]);
    fixture.detectChanges();

    let containers = fixture.nativeElement.querySelectorAll('[data-testid="container-current-bookings"]');
    expect(containers.length).toBe(0);

    component.current_bookings.set([
      {
        schedule: new Date("December 17, 2026 10:00:00"),
        doctor_name: 'Frederik',
        doctor_address: '123 Main St'
      },
      {
        schedule: new Date("May 05, 2027 11:00:00"),
        doctor_name: 'George',
        doctor_address: '123 Main St'
      }
    ])
    fixture.detectChanges();

    containers = fixture.nativeElement.querySelectorAll('[data-testid="container-current-bookings"]');
    expect(containers.length).toBe(2)
    expect(containers[0].textContent).toContain('Frederik');
    expect(containers[1].textContent).toContain('George');
  })

  it('should successfully await and load appointments', async () => {
    fixture.detectChanges();
    await component.ngOnInit();
    fixture.detectChanges();
    expect(component.results).toEqual([
      { id: 'app-1', doctorId: 'doc-1', patientId: 'patient-123', scheduleTime: tomorrow},
      { id: 'app-1', patientId: 'patient-456', doctorId: 'doc-1', scheduleTime: yesterday}]);
  });

  it('should have data in current booking', async () => {
    component.current_bookings.set([]);
    await component.ngOnInit();
    const finalBookings = component.current_bookings();
    expect(finalBookings.length).toBe(1);
  });

  it('should have data in past booking', async () => {
    component.past_bookings.set([]);
    await component.ngOnInit();
    const finalBookings = component.past_bookings();
    expect(finalBookings.length).toBe(1);
  });

});
