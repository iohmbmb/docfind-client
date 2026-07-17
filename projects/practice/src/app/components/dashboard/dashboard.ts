import {Component, inject, signal} from '@angular/core';
import {AppointmentService} from '@shared/services/appointment.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private appointmentService = inject(AppointmentService);
  private currentDoctorId = '8fb99128-de23-4463-818b-9e883de63a1c'

  pageData : any = null
  errorMessage : string | null = null;
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.appointmentService.getAppointmentsFor(this.currentDoctorId).subscribe({
      next: (response) => {
        this.pageData = response;
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage = 'No appointments';
        this.isLoading.set(false);
        console.error('Page load error: ', err);
      }
    })
  }
}
