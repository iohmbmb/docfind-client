import {Component, inject, signal} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {BookingStateService} from '@shared/services/booking-state-service';
import {DatePipe, JsonPipe} from '@angular/common';

@Component({
  selector: 'booking-for-when',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    DatePipe,
    JsonPipe,
  ],
  templateUrl: './for-when.component.html',
  styleUrl: './for-when.component.css',
})
export class ForWhen {
  private bookingStateService = inject(BookingStateService);
  public days = signal<Date[]>([]);


  async ngOnInit() {
    this.days.set(this.bookingStateService.getDoctorNextWorkDays())
    console.log(this.days())
  }
}
