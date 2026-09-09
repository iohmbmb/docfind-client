import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreferencesGeneral } from './preferences-general';
import {of} from 'rxjs';
import {AuthService} from '@shared/services/auth.service';
import {UserService} from '@shared/services/user.service';
import {ScheduleService} from '@shared/services/schedule';

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
      email: 'john@example.com',
      status: 'Available'
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
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component).toBeTruthy();
  });
});
