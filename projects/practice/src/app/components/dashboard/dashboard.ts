import {Component, inject, signal} from '@angular/core';
import {AppointmentService} from '@shared/services/appointment.service';
import {firstValueFrom} from 'rxjs';
import {AuthService} from '@shared/services/auth.service';
import {AppointmentStatus} from '@shared/models/appointment.types';
import {UserService} from '@shared/services/user.service';
import {DatePipe} from '@angular/common';

type Infos = {
  name: string;
  email: string;
  visitType: string | undefined;
  date: Date;
  status: AppointmentStatus | undefined;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  dashboardInfos = signal<Infos[]>([])
  errorMessage : string | null = null;
  isLoading = signal<boolean>(true);

  async ngOnInit() {
    try{
      const doctor = await firstValueFrom(this.authService.getId());
      const appointments = await firstValueFrom(this.appointmentService.getAppointmentsFor(doctor.id));
      console.log(appointments.length, 'appointments');
      if(appointments.length > 0){
        for(const appointment of appointments){
          try{
            const patient = await firstValueFrom(this.userService.getUser(appointment.patientId))
            this.dashboardInfos.update(model =>[
              ...model,
              {
                name: patient.firstName+" "+patient.lastName,
                email: patient.email,
                visitType: appointment.consultationType,
                date: new Date(appointment.scheduleTime),
                status: appointment.status
              }
            ])
          }
          catch (err){
            console.log(err);
          }
        }
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
