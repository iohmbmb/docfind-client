import {Component, inject} from '@angular/core';
import {AuthService} from '@shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  public authService = inject(AuthService);
  private router = inject(Router);
  public async onSubmitToSignUp() : Promise<void> {
    this.router.navigate(['/signup']);
  }
}
