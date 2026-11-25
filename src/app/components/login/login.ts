import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {LoginRequest} from '../../models/login.types';
import {CommonModule} from '@angular/common';
import {catchError, firstValueFrom, identity, of, tap} from 'rxjs';
import {Identity} from '@shared/models/identity.types';
import { Demobar } from '../demobar/demobar';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    Demobar
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private returnUrl: string = '/dashboard';

  public credentials: LoginRequest = { email: '', password: ''};
  public rememberMe = signal<boolean>(false);

  public errorMessage = signal<string>('')
  public isLoading = signal<boolean>(false);

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  public async onSubmit() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    try {
      const responsePromise = firstValueFrom(this.authService.loginRequest(this.credentials)).catch(err => {console.error(err); return of(false)});
      const mePromise = firstValueFrom(this.authService.getId()).catch(
        err => {
          console.error(err);
          var id : Identity = {id:null};
          return id
        })
      const [response, me] = await Promise.all([responsePromise, mePromise]);
      if(response){
        this.isLoading.set(false);
        if (this.rememberMe()) {
          localStorage.setItem('remember_user_email', this.credentials.email);
        }
        await this.router.navigateByUrl(this.returnUrl);
      }
      if(me?.id != null){
        localStorage.setItem('user_id', me.id);
      }
    }
    catch (err) {
      this.isLoading.set(false);
      this.errorMessage.set('Invalid email or password. Please try again.');
      console.error(err);
    }
  }
}
