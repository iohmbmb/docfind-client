import {Component, inject, signal} from '@angular/core';
import {Forwhoform} from '../forwhoform/forwhoform';
import {Appointments, AppointmentStatus} from '@shared/models/appointment.types';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {AppointmentService} from '@shared/services/appointment.service';
import {Forwhereform} from '../forwhereform/forwhereform';
import {Forwhatform} from '../forwhatform/forwhatform';
import {Forwhenform} from '../forwhenform/forwhenform';
import {Doctor} from '@shared/models/doctor.types';
import {User, UserRole} from '@shared/models/user.types';

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

  public currentStep = signal<number>(1);

  // this is temporary to be able to reason about the data that will be passed in
  public doctor!: Doctor;
  public user: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    role: UserRole.patient
  };

  public appointmentModel= signal<Appointments>({
    patientId: this.user.id,
    doctorId:'',
    scheduleTime:'',
    location:'',
    isNewPatient:true,
    status: AppointmentStatus.Pending,
  });

  private errorMessage = signal<string>('');

  public nextStep = () => {
    this.currentStep.update(step => step + 1);
  }

  public previousStep = () => {
    this.currentStep.update(step => step - 1);
  }

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
