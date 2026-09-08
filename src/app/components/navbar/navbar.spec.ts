import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbar } from './navbar';
import {provideRouter, Router} from '@angular/router';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout and redirect to home', async () =>{
    const router = TestBed.inject(Router);
    const spyOnRouter = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const spyLogout = vi.spyOn(component.authService, 'logout');
    component.onSubmit();
    expect(spyLogout).toHaveBeenCalled();
    expect(spyOnRouter).toHaveBeenCalledWith(['/']);
  });

  it('should display a nav variant if logged in', () => {
    component.authService.isAuthenticated.set(false);
    let navElement = fixture.nativeElement.querySelector('[data-testid="nav-logged"]');
    expect(navElement).toBeNull();
    component.authService.isAuthenticated.set(true);
    fixture.detectChanges();
    navElement = fixture.nativeElement.querySelector('[data-testid="nav-logged"]');
    expect(navElement).toBeTruthy();
  });

  it('should click on the logout button if logged in', () => {
    const spyOnLogout = vi.spyOn(component, 'onSubmit');
    component.authService.isAuthenticated.set(true);
    fixture.detectChanges();
    const navElement = fixture.nativeElement.querySelector('[data-testid="nav-logged"]');
    expect(navElement).toBeTruthy();
    const logoutButton = navElement.querySelector('[data-testid="btn-logout"]');
    logoutButton?.click();
    fixture.detectChanges();
    expect(spyOnLogout).toHaveBeenCalled();
  });
});
