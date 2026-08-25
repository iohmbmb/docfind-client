import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import {LoginComponent} from './components/login/login';
import {HomeComponent} from './components/home/home';
import {SignupComponent} from './components/signup/signup';
import {SearchComponent} from './components/searchbar/searchbar';
import {DashboardComponent} from './components/dashboard/dashboard';
import {BookingFormComponent} from './components/booking-form/bookingform';
import {bookingGuard} from '@shared/guards/booking-guard';
import {guestGuard} from './guards/guest-guard';


export const routes: Routes = [
  // Fallbacks
  { path: '', component: HomeComponent },

  // Public Routes (Anyone can access these paths)
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
  { path: 'search', component: SearchComponent },

  // Protected Routes (Strictly locked down by the session filter)
  { path: 'booking', component: BookingFormComponent, canActivate:[authGuard(['Patient']), bookingGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard(['Patient'])] },

  // Catch-all safety boundary routing
  { path: '**', redirectTo: '' }
];
