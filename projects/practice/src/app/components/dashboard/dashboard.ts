import {Component, inject, signal} from '@angular/core';
import {AppointmentService} from '@shared/services/appointment.service';
import {firstValueFrom} from 'rxjs';
import {AuthService} from '@shared/services/auth.service';
import {Appointments, AppointmentStatus} from '@shared/models/appointment.types';
import {UserService} from '@shared/services/user.service';
import {DatePipe} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';

declare var feather : any;

type Infos = {
  appointmentId: string | undefined;
  name: string;
  email: string;
  visitType: string | undefined;
  date: Date;
  status: AppointmentStatus | undefined;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    MatTooltip
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private appointments : Appointments[] = [];

  dashboardInfos = signal<Infos[]>([])
  errorMessage : string | null = null;
  isLoading = signal<boolean>(true);

  //TODO: test
  async ngOnInit() {
    try{
      const doctor = await firstValueFrom(this.authService.getId());
      this.appointments = await firstValueFrom(this.appointmentService.getAppointmentsFor(doctor.id));
      if(this.appointments.length > 0){
        for(const appointment of this.appointments){
          try{
            const patient = await firstValueFrom(this.userService.getUser(appointment.patientId))
            this.dashboardInfos.update(model =>[
              ...model,
              {
                appointmentId: appointment.id,
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
    setTimeout(() => feather.replace())
  }

  ngAfterViewInit() {
    setTimeout(() => feather.replace())
  }

  //TODO: test
  async onConfirm(info: Infos){
    const appointment = this.appointments.find(appointment => appointment.id === info.appointmentId);
    if(appointment?.status)
      appointment.status = AppointmentStatus.Confirmed;
    try{
      if(appointment && info.appointmentId)
        await firstValueFrom(this.appointmentService.updateAppointment(info.appointmentId, appointment))
        info.status = AppointmentStatus.Confirmed;
    } catch (err) {
      console.log(err);
    }
  }

  //TODO: test
  async onCancel(info: Infos){
    const appointment = this.appointments.find(appointment => appointment.id === info.appointmentId);
    if(appointment?.status)
      appointment.status = AppointmentStatus.Cancelled;
    try{
      if(appointment && info.appointmentId)
        await firstValueFrom(this.appointmentService.updateAppointment(info.appointmentId, appointment))
        info.status = AppointmentStatus.Cancelled;
    } catch (err) {
      console.log(err);
    }
  }
  //TODO: test
  async onDelete(info: Infos){
    const appointment = this.appointments.find(appointment => appointment.id === info.appointmentId);
    try{
      if(appointment && info.appointmentId)
        await firstValueFrom(this.appointmentService.deleteAppointment(info.appointmentId))
        this.dashboardInfos.update(model => model.filter(appointment => appointment.appointmentId !== info.appointmentId))
    } catch (err) {
      console.log(err);
    }
  }

  protected readonly AppointmentStatus = AppointmentStatus;
}
