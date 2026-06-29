import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SearchComponent} from '../searchbar/searchbar';

@Component({
  selector: 'app-home',
  imports: [
    SearchComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    const token = localStorage.getItem('healthcare_jwt');
    const role = localStorage.getItem('user_role');
    if (token) {
      if (role === 'Doctor') {
        this.router.navigate(['/doctor-dashboard']);
      } else {
        this.router.navigate(['/patient-dashboad']);
      }
    }
  }
}
