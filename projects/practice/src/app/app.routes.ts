import { Routes } from '@angular/router';
import {authGuard} from '../../../../src/app/guards/auth-guard';
import {guestGuard} from '../../../../src/app/guards/guest-guard';
import {HomeComponent} from './components/home/home';
import {Dashboard} from './components/dashboard/dashboard';
import {LoginComponent} from './components/login/login';
import {SignupComponent} from './components/signup/signup';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  // Public Routes (Anyone can access these paths)
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard(['Doctor'])] },

  // Catch-all safety boundary routing
  { path: '**', redirectTo: '' }
];
