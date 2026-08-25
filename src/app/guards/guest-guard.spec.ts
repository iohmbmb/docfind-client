import { TestBed } from '@angular/core/testing';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';

import { guestGuard } from './guest-guard';

describe('guestGuard', () => {
  let mockRouterSpy: {
    lastNavigatedTo: any[] | null;
    navigate: (commands: any[]) => boolean;
  }
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => guestGuard(...guardParameters));

  beforeEach(() => {
    mockRouterSpy = {
      lastNavigatedTo: null,
      navigate: function(commands: any[]) {
        this.lastNavigatedTo = commands;
        return true;
      }
    };
    TestBed.configureTestingModule({
      providers: [{provide: Router, useValue: mockRouterSpy}]
    });
  });

  afterEach(() => {
    localStorage.clear();
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should navigate to booking if user is logged in', () => {
    localStorage.clear();
    localStorage.setItem('healthcare_jwt', 'valid-token');
    localStorage.setItem('user_role', 'Patient');
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBe(false)
    expect(mockRouterSpy.lastNavigatedTo).toEqual(['/booking']);
  })

  it('should navigate to dashboard if doctor is logged in', () => {
    localStorage.clear();
    localStorage.setItem('healthcare_jwt', 'valid-token');
    localStorage.setItem('user_role', 'Doctor');
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBe(false)
    expect(mockRouterSpy.lastNavigatedTo).toEqual(['/dashboard']);
  })

  it('should not navigate if the user is not logged in', () => {
    localStorage.clear();
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBe(true);
    expect(mockRouterSpy.lastNavigatedTo).toBeNull();
  })

});
