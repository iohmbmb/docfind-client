import {Component, computed, inject, signal} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {BookingStateService} from '@shared/services/booking-state-service';
import {DatePipe} from '@angular/common';
import {BookingWizardService} from '@shared/services/booking-wizard-service';

@Component({
  selector: 'booking-for-when',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    DatePipe,
  ],
  templateUrl: './for-when.component.html',
  styleUrl: './for-when.component.css',
})
export class ForWhen {
  public bookingStateService = inject(BookingStateService);
  public days = signal<Date[]>([]);


  async ngOnInit() {
    this.days.set(this.bookingStateService.getDoctorNextWorkDays())
  }

  scheduleMap = computed(() => {
    const map = new Map<string, Date[]>();

    for (const day of this.days()) {
      const dayOfWeek = this.bookingStateService.convertDayToDayOfWeek(day.getDay());
      const dailyHours = this.bookingStateService.getDoctorWorkHours(dayOfWeek);

      map.set(day.toDateString(), dailyHours || []);
    }
    return map;
  });

  onSelect(day:Date, hour:Date){
    const appointmentDate = new Date(day)
    appointmentDate.setHours(hour.getHours(), hour.getMinutes(), 0, 0);
    this.bookingStateService.selectedAppointment.set(appointmentDate);
    this.bookingStateService.updateAppointmentModel({ scheduleTime: appointmentDate})
  }
}
