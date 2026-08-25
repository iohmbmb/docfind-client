import { TestBed } from '@angular/core/testing';
import {ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot} from '@angular/router';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  let executeGuard: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => any;
  let mockRouterSpy: {
    lastNavigatedTo: any[] | null;
    navigate: (commands: any[]) => boolean;
  };

  beforeEach(() => {
    mockRouterSpy = {
      lastNavigatedTo: null,
      navigate: function(commands: any[]) {
        this.lastNavigatedTo = commands;
        return true;
      }
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouterSpy }]
    });

    const innerGuard = authGuard(['Patient'])
    executeGuard = (route, state) =>
      TestBed.runInInjectionContext(() => innerGuard(route, state));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should deny navigation and redirect to login if no token or role exists', () => {
    localStorage.clear();

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);

    expect(mockRouterSpy.lastNavigatedTo).toEqual(['/login']);
  });

  it('should allow navigation if the user has the matching Patient role', () => {
    localStorage.setItem('healthcare_jwt', 'fake-valid-token');
    localStorage.setItem('user_role', 'Patient');

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);

    expect(mockRouterSpy.lastNavigatedTo).toBeNull();
  });


  it('should deny navigation if the role or the token are invalid and redirect to login', () => {
    localStorage.setItem('healthcare_jwt', 'fake-valid-token');
    localStorage.setItem('user_role', 'Guess');

    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(false);
    expect(mockRouterSpy.lastNavigatedTo).toEqual(['/login']);
    localStorage.clear();
  });
});
