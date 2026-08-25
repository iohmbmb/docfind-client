import { Component, inject } from '@angular/core';
import {BookingWizardService} from '@shared/services/booking-wizard-service';
import {BookingStateService} from '@shared/services/booking-state-service';

@Component({
  selector: 'booking-for-who',
  imports: [],
  templateUrl: './for-who.component.html',
  styleUrl: './for-who.component.css',
})
export class ForWho {
  private bookingStateService = inject(BookingStateService);
  private bookingWizardService = inject(BookingWizardService);

  public onSubmit(isForSomeone: boolean){
    this.bookingStateService.updateAppointmentModel(({isForSomeone: isForSomeone}));
    this.bookingWizardService.nextStep();
  };
}
