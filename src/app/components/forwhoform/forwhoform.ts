import { Component, inject } from '@angular/core';
import {BookingFormsComponent} from '../bookingforms/bookingforms';

@Component({
  selector: 'app-forwhoform',
  imports: [],
  templateUrl: './forwhoform.html',
  styleUrl: './forwhoform.css',
})
export class Forwhoform {
  private bookingForm = inject(BookingFormsComponent);

  public onSubmit(isNew: boolean){
    this.bookingForm.appointmentModel().isNewPatient = isNew;
    this.bookingForm.nextStep();
  };
}
