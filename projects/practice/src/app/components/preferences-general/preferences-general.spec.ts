import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreferencesGeneral } from './preferences-general';
import {of} from 'rxjs';
import {AuthService} from '@shared/services/auth.service';
import {UserService} from '@shared/services/user.service';
import {ScheduleService} from '@shared/services/schedule';
import { PracticeSpecialty } from "@shared/models/practice-specialty";
import { Availability } from "@shared/models/availability";
import { LocationPreference } from "@shared/models/location-preference";

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('PreferencesGeneral', () => {
  let component: PreferencesGeneral;
  let fixture: ComponentFixture<PreferencesGeneral>;
  let mockAuthService: { getId: ReturnType<typeof vi.fn> };
  let mockUserService: { getDoctor: ReturnType<typeof vi.fn> };
  let mockScheduleService: { getWorkHours: ReturnType<typeof vi.fn>; getAbsence: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    }
    mockAuthService = { getId: vi.fn() };
    mockUserService = { getDoctor: vi.fn() };
    mockScheduleService = { getWorkHours: vi.fn(), getAbsence: vi.fn() };

    mockAuthService.getId.mockReturnValue(of({ id: 'doc-123' }));
    mockUserService.getDoctor.mockReturnValue(of({
      firstName: 'John',
      lastName: 'Doe',
      email: 'doctor@example.com',
      practiceName: 'Clinic',
      practiceAddress: '123 Main St',
      practicePhone: '555-1234',
      practicePostcode: '12345',
      practiceState: 'State',
      practiceSuburb: 'Suburb',
      hourlyRate: 150.0,
      specialty: PracticeSpecialty.GeneralPractice,
      status: Availability.Available,
      preference: LocationPreference.Hybrid
    }));
    mockScheduleService.getWorkHours.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [PreferencesGeneral],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: ScheduleService, useValue: mockScheduleService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreferencesGeneral);
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
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(component).toBeTruthy();
  });
});
