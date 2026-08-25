import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn, DefaultUrlSerializer,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { bookingGuard } from './booking-guard';
import {BookingStateService} from '@shared/services/booking-state-service';
import {Availability} from '@shared/models/availability';
import {LocationPreference} from '@shared/models/location-preference';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {WritableSignal, signal} from '@angular/core';
import {ConsultationType} from '@shared/models/consultation-type.types';

describe('bookingGuard', () => {
  let mockRouterSpy: {
    lastNavigatedTo: UrlTree | null;
    createUrlTree: (commands: any[]) => UrlTree;
  };

  let mockBookingStateService: {
    getDoctorModel: () => any;
  };

  let currentDoctor: WritableSignal<{
    id: string; email: string; firstName: string; lastName: string;
    practiceName: string; practiceAddress: string; practiceSuburb: string;
    practiceState: string; practicePostcode: string; practicePhone: string;
    biography: string; hourlyRate: number;
    status: Availability; preference: LocationPreference;
    specialty: PracticeSpecialty;
    consultationType: ConsultationType;
  }>;

  const executeGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
      TestBed.runInInjectionContext(() => bookingGuard(route, state));

  beforeEach(() => {
    const serializer = new DefaultUrlSerializer();
    mockRouterSpy = {
      lastNavigatedTo: null,
      createUrlTree: (commands: any[]) => {
        const tree = serializer.parse('/'+commands.join('/'));
        mockRouterSpy.lastNavigatedTo = tree;
        return tree;
      }
    };

    currentDoctor = signal({
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      practiceName: '',
      practiceAddress: '',
      practiceSuburb: '',
      practiceState: '',
      practicePostcode: '',
      practicePhone: '',
      biography: '',
      hourlyRate: 0,
      status: Availability.Available,
      preference: LocationPreference.Hybrid,
      specialty: PracticeSpecialty.GeneralPractice,
      consultationType: {
        new: [],
        existing: [],
      },
    });

    mockBookingStateService = {
      getDoctorModel: () => currentDoctor()
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouterSpy },
        {provide: BookingStateService, useValue: mockBookingStateService}
      ]
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should navigate if doctor is selected', () => {
    currentDoctor.set({
      id: 'valid-id',
      email: 'mail',
      firstName:'name', lastName:'name',
      practiceName: 'practice',
      practiceAddress: 'address',
      practiceSuburb: 'suburb',
      practiceState: 'state',
      practicePostcode: 'postcode',
      practicePhone: 'phone',
      biography: '',
      hourlyRate: 40,
      status: Availability.Available,
      preference: LocationPreference.Hybrid,
      specialty: PracticeSpecialty.GeneralPractice,
      consultationType: {
        new: ['consultation-1', 'consultation-2'],
        existing: ['consultation-3'],
      },
    })

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
    expect(mockRouterSpy.lastNavigatedTo).toBeNull();
  })

  it('should redirect if doctor is not selected', () => {
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const result = executeGuard(mockRoute, mockState) as UrlTree;
    const serializer = new DefaultUrlSerializer();
    const expectedTree = serializer.parse('/search');

    expect(result).toEqual(expectedTree);
    expect(mockRouterSpy.lastNavigatedTo).toEqual(expectedTree);
  })
});
