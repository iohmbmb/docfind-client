import {Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AppointmentService} from '@shared/services/appointment.service';
import {BookingStateService} from '@shared/services/booking-state-service';
import {Appointments} from '@shared/models/appointment.types';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-bookings',
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  private appointmentService = inject(AppointmentService);
  private bookingStateService = inject(BookingStateService);
  public appointments = signal<Appointments[]>([]);


 async ngOnInit() {
    const results = await firstValueFrom(this.appointmentService.getAppointmentsFor(this.bookingStateService.patientId()));
    this.appointments.set(results)
  }
}
