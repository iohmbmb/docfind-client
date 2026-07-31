import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import {LoginComponent} from './components/login/login';
import {HomeComponent} from './components/home/home';
import {SignupComponent} from './components/signup/signup';
import {SearchComponent} from './components/searchbar/searchbar';
import {BookingsComponent} from './components/bookings/bookings';
import {guestGuard} from './guards/guest-guard';
import {BookingFormsComponent} from './components/bookingforms/bookingforms';


export const routes: Routes = [
  // Fallbacks
  { path: '', component: HomeComponent },

  // Public Routes (Anyone can access these paths)
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
  { path: 'search', component: SearchComponent },

  // Protected Routes (Strictly locked down by the session filter)
  { path: 'booking', component: BookingFormsComponent, canActivate:[authGuard(['Patient'])]},
  { path: 'bookings', component: BookingsComponent, canActivate: [authGuard(['Patient'])] },

  // Catch-all safety boundary routing
  { path: '**', redirectTo: '' }
];
