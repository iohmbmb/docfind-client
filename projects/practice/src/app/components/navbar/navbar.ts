import {AuthService} from '@shared/services/auth.service';
import {environment} from '../../../../../../src/environments/environment.development';
import {Component, inject, computed, signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
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
  public authService = inject(AuthService);
  public patientPortalUrl = environment.patientPortalUrl;

  public currentPath= signal<string>('');

  public isLoginPage = computed(() => this.currentPath() === '/login');
  public isSignupPage = computed(() => this.currentPath() === '/signup');

  public onSubmit() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  constructor(private router: Router) {
    router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    takeUntilDestroyed()).subscribe(() => {
      this.currentPath.set(router.url);
    })
  }

  public onSettings(){
    this.router.navigate(['/preferences']);
  }

  public onSubmitToRegister(){
    this.authService.logout();
    this.router.navigate(['/signup']);
  }
}
