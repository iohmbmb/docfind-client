import {Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AppointmentService} from '@shared/services/appointment.service';
import {BookingStateService} from '@shared/services/booking-state-service';
import {firstValueFrom} from 'rxjs';
import {DatePipe} from '@angular/common';
import {UserService} from '@shared/services/user.service';
import {Appointments} from '@shared/models/appointment.types';

export type AppointmentData = {
  schedule: Date;
  doctor_name: string;
  doctor_address: string;
}

@Component({
  selector: 'app-bookings',
  imports: [
    RouterLink,
    DatePipe
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
   var now = new Date();
   if(this.bookingStateService.patientId() != null){
     this.results = await firstValueFrom(this.appointmentService.getAppointmentsFor(this.bookingStateService.patientId()));
     for(let appoints of this.results){
       let doctor = await firstValueFrom(this.doctorService.getDoctor(appoints.doctorId))
       if(+appoints.scheduleTime > +now){
         this.current_bookings.update(model => [
           ...model,
           {
             schedule: appoints.scheduleTime,
             doctor_name: doctor.firstName+" "+doctor.lastName,
             doctor_address: doctor.practiceAddress+', '+doctor.practiceSuburb+', '+doctor.practiceState+', '+doctor.practicePostcode
           }]);
       } else {
         this.past_bookings.update(model => [
           ...model,
           {
             schedule: appoints.scheduleTime,
             doctor_name: doctor.firstName+" "+doctor.lastName,
             doctor_address: doctor.practiceAddress+', '+doctor.practiceSuburb+', '+doctor.practiceState+', '+doctor.practicePostcode
           }
         ]);
       }
     }
   }
  }
}
