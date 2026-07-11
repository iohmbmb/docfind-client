import {Component, inject, signal} from '@angular/core';
import {Forwhoform} from '../forwhoform/forwhoform';
import {Appointments, AppointmentStatus} from '@shared/models/appointment.types';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {AppointmentService} from '@shared/services/appointment.service';
import {Forwhereform} from '../forwhereform/forwhereform';
import {Forwhatform} from '../forwhatform/forwhatform';
import {Forwhenform} from '../forwhenform/forwhenform';

@Component({
  selector: 'app-bookingforms',
  imports: [
    Forwhoform,
    Forwhereform,
    Forwhatform,
    Forwhenform
  ],
  templateUrl: './bookingforms.html',
  styleUrl: './bookingforms.css',
})
export class BookingFormsComponent {

  private appointmentService = inject(AppointmentService);
  private router = inject(Router);

  public appointmentModel= signal<Appointments>({
    patientId:'',
    doctorId:'',
    scheduleTime:'',
    location:'',
    isNewPatient:true,
    status: AppointmentStatus.Pending,
    symptoms:'',
  });

  private errorMessage = signal<string>('');

  public async onSubmit() {
    this.errorMessage.set('')
    try {
      await firstValueFrom(this.appointmentService.createAppointment(this.appointmentModel()))
    } catch(err) {
      this.errorMessage.set('Failed to create appointment');
      console.log(err)
    }
  }
}
