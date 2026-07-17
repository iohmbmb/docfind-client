import { Routes } from '@angular/router';
import {authGuard} from '@shared/guards/auth-guard';
import {guestGuard} from '@shared/guards/guest-guard';
import {HomeComponent} from './components/home/home';
import {Dashboard} from './components/dashboard/dashboard';
import {LoginComponent} from './components/login/login';
import {SignupComponent} from './components/signup/signup';
import {Preferences} from './components/preferences/preferences';

export const routes: Routes = [

  { path: '', component: HomeComponent },

  // Public Routes (Anyone can access these paths)
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },

  { path: 'dashboard', component: Dashboard, canActivate: [authGuard(['Doctor'])] },
  { path: 'preferences', component: Preferences, canActivate: [authGuard(['Doctor'])]},

  // Catch-all safety boundary routing
  { path: '**', redirectTo: '' }
];
