import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {environment} from '../../../environments/environment.development';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  public authService = inject(AuthService);
  public practicePortalUrl = environment.practicePortalUrl;

  get isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }

  public onSubmit(){
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
