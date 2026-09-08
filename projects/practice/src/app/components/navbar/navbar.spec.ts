import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import {provideRouter} from '@angular/router';
import {Preferences} from '../preferences/preferences';
import {SignupComponent} from '../signup/signup';
import {HomeComponent} from '../home/home';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([
        { path: 'preferences', component: Preferences },
        { path: 'signup', component: SignupComponent },
        { path: '', component: HomeComponent },
      ])]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click register button', () => {
    const spyOnRegister = vi.spyOn(component, 'onSubmitToRegister');
    const btnRegister = fixture.nativeElement.querySelector('[data-testid="btn-register"]');
    btnRegister.click();
    fixture.detectChanges();
    expect(spyOnRegister).toHaveBeenCalled();
  });

  it('should display nav variant if in login page', async () => {
    component.authService.isAuthenticated.set(false);
    component.currentPath.set('/login');
    fixture.detectChanges();
    expect(component.isLoginPage()).toBe(true);
    const navElement = fixture.nativeElement.querySelector('[data-testid="nav-logged"]');
    expect(navElement).toBeTruthy();
  });

  it('should display nav variant if authenticated and click logout', () => {
    const spyOnLogout = vi.spyOn(component, 'onSubmit');
    component.authService.isAuthenticated.set(true);
    fixture.detectChanges();
    const navElement = fixture.nativeElement.querySelector('[data-testid="auth-nav"]');
    const logoutButton = navElement.querySelector('[data-testid="btn-logout"]');
    expect(navElement).toBeTruthy();
    logoutButton.click();
    fixture.detectChanges();
    expect(spyOnLogout).toHaveBeenCalled();
  })

  it('should click settings if authenticated', () => {
    const spyOnSettings = vi.spyOn(component, 'onSettings');
    component.authService.isAuthenticated.set(true);
    fixture.detectChanges();
    const settingsButton = fixture.nativeElement.querySelector('[data-testid="btn-settings"]');
    settingsButton.click();
    fixture.detectChanges();
    expect(spyOnSettings).toHaveBeenCalled();
  })
});
