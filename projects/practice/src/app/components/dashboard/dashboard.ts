import {Component, inject, signal} from '@angular/core';
import {AppointmentService} from '@shared/services/appointment.service';
import {firstValueFrom} from 'rxjs';

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

  async ngOnInit() {
    try{
      const appointments = await firstValueFrom(this.appointmentService.getAppointmentsFor(this.currentDoctorId));
      if(appointments.length > 0){
        this.pageData = appointments;
      }
      else{
        this.errorMessage = 'No appointments';
      }
      this.isLoading.set(false);
    }
    catch (err) {
      this.errorMessage = 'No appointments';
      this.isLoading.set(false);
    }
  }
}
