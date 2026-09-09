import {AuthService} from '@shared/services/auth.service';
import {environment} from '../../../../../../src/environments/environment.development';
import {Component, inject, computed, signal, DestroyRef} from '@angular/core';
import {Router, RouterLink, NavigationEnd} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter} from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  public authService = inject(AuthService);
  public patientPortalUrl = environment.patientPortalUrl;

  public currentPath = signal<string>(this.router.url);

  public isLoginPage = computed(() => this.currentPath() === '/login');
  public isSignupPage = computed(() => this.currentPath() === '/signup');

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(inject(DestroyRef))
    ).subscribe(() => {
      this.currentPath.set(this.router.url);
    });
  }

  public onSubmit() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  public onSettings(){
    this.router.navigate(['/preferences']);
  }

  public onSubmitToRegister(){
    this.authService.logout();
    this.router.navigate(['/signup']);
  }
}
