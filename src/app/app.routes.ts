import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import {Component} from '@angular/core';
import {LoginComponent} from './components/login/login';
import {HomeComponent} from './components/home/home';
import {SignupComponent} from './components/signup/signup';
import {SearchComponent} from './components/searchbar/searchbar';

@Component({ selector: 'booking-form-component', standalone: true, template: '<div class="p-8 font-bold text-slate-700">Booking Form Page Placeholder</div>' })
class BookingFormComponent{}

export const routes: Routes = [
  // Fallbacks
  { path: '', component: HomeComponent },

  // Public Routes (Anyone can access these paths)
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'search', component: SearchComponent },

  // Protected Routes (Strictly locked down by the session filter)
  { path: 'booking', component: BookingFormComponent, canActivate: [authGuard] },

  // Catch-all safety boundary routing
  { path: '**', redirectTo: '' }
];
