import {Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AppointmentService} from '@shared/services/appointment.service';
import {BookingStateService} from '@shared/services/booking-state-service';
import {catchError, firstValueFrom, of, tap} from 'rxjs';
import {DatePipe} from '@angular/common';
import {UserService} from '@shared/services/user.service';
import {Appointments, AppointmentStatus} from '@shared/models/appointment.types';
import {Doctor} from '@shared/models/doctor.types';
import { Demobar } from '../demobar/demobar';

export type AppointmentData = {
  schedule: Date;
  doctor_name: string;
  doctor_address: string;
  status: AppointmentStatus | undefined;
}

@Component({
  selector: 'app-bookings',
  imports: [
    RouterLink,
    DatePipe,
    Demobar
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  private appointmentService = inject(AppointmentService);
  private bookingStateService = inject(BookingStateService);
  private doctorService = inject(UserService);
  public current_bookings = signal<AppointmentData[]>([]);
  public past_bookings = signal<AppointmentData[]>([]);
  results: Appointments[] = [];

 async ngOnInit() {
   const now = new Date();
   if(this.bookingStateService.patientId() != null){

     const appointments = await firstValueFrom(this.appointmentService.getAppointmentsFor(this.bookingStateService.patientId())
        .pipe(
          tap({
            error: (err) => console.error('Error fetching appointments:', err)}),
         catchError(() => of([]))
       ));

     const doctor = await Promise.all(appointments.map(async (appointments) => {
       return firstValueFrom(this.doctorService.getDoctor(appointments.doctorId)).catch(err => {console.error(err); return {firstName:null, lastName:null, practiceAddress:null, practiceSuburb:null, practiceState:null, practicePostcode:null}});
     }))

     const past_bookings = appointments
       .map((appointment, i) => ({appointment, doctor: doctor[i]}))
       .filter(({appointment}) => {
       const scheduledTime = new Date(appointment.scheduleTime);
       return  scheduledTime < now || appointment.status == AppointmentStatus.Cancelled}).map(({appointment, doctor}) => ({
         schedule: appointment.scheduleTime,
         doctor_name: doctor.firstName+" "+doctor.lastName,
         doctor_address: doctor.practiceAddress+', '+doctor.practiceSuburb+', '+doctor.practiceState+', '+doctor.practicePostcode,
         status: appointment.status
       }));

     this.past_bookings.update(model => [
       ...model,
       ...past_bookings,
     ]);

     const current_bookings = appointments
       .map((appointment, i) => ({appointment, doctor: doctor[i]}))
       .filter(({appointment}) => {
         const scheduledTime = new Date(appointment.scheduleTime);
         return  scheduledTime > now && appointment.status != AppointmentStatus.Cancelled}).map(({appointment, doctor}) => ({
         schedule: appointment.scheduleTime,
         doctor_name: doctor.firstName+" "+doctor.lastName,
         doctor_address: doctor.practiceAddress+', '+doctor.practiceSuburb+', '+doctor.practiceState+', '+doctor.practicePostcode,
         status: appointment.status
       }));

     this.current_bookings.update(model => [
       ...model,
       ...current_bookings,
     ]);
   }
  }

  protected readonly AppointmentStatus = AppointmentStatus;
}
