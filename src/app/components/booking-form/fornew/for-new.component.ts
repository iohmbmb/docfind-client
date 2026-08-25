import {Component, inject} from '@angular/core';
import {BookingStateService} from '@shared/services/booking-state-service';
import {BookingWizardService} from '@shared/services/booking-wizard-service';

@Component({
  selector: 'booking-for-new',
  imports: [],
  templateUrl: './for-new.component.html',
  styleUrl: './for-new.component.css',
})
export class ForNew {
  private bookingStateService = inject(BookingStateService);
  private bookingWizardService = inject(BookingWizardService);

  public onSubmit(isNew: boolean){
    this.bookingStateService.updateAppointmentModel(({isNewPatient: isNew}))
    this.bookingWizardService.nextStep();
  };
}
