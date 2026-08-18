import {Component, computed, inject, signal} from '@angular/core';
import {BookingStateService} from '@shared/services/booking-state-service';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {AppointmentService} from '@shared/services/appointment.service';

@Component({
  selector: 'app-booking-summary',
  imports: [],
  templateUrl: './booking-summary.html',
  styleUrl: './booking-summary.css',
})
export class BookingSummary {
  private router = inject(Router);
  private appointmentService = inject(AppointmentService);
  private errorMessage = signal<string>('');
  public bookingStateService = inject(BookingStateService);
  private days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  public day = computed(() => {
    return this.days[this.bookingStateService.selectedAppointment()?.getDay()!];
  })

  public async onSubmit() {
    this.errorMessage.set('')
    try {
      await firstValueFrom(this.appointmentService.createAppointment(this.bookingStateService.getAppointmentModel()))
      this.bookingStateService.clearBookingState()
      this.router.navigate(['/dashboard'])
    } catch(err) {
      this.errorMessage.set('Failed to create appointment');
      console.log(err)
    }
  }
  public onCancel(){
    this.bookingStateService.clearBookingState()
    this.router.navigate(['/']);
  }
}
