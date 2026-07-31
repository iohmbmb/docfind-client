import {Component, inject} from '@angular/core';
import {BookingFormsComponent} from '../bookingforms/bookingforms';

@Component({
  selector: 'app-forwhereform',
  imports: [],
  templateUrl: './forwhereform.html',
  styleUrl: './forwhereform.css',
})
export class Forwhereform {
  private bookingForm = inject(BookingFormsComponent);

  public onSubmit(isRemote: boolean){
    if (isRemote) {
      this.bookingForm.appointmentModel().location = 'Video call';
    } else {
      this.bookingForm.appointmentModel.update(model =>({
        ...model,
        location: this.bookingForm.doctor()?.practiceAddress!
      }));
    }
    this.bookingForm.nextStep();
  };
}
