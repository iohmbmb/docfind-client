import {Component, inject, signal} from '@angular/core';
import {BookingWizardService} from '@shared/services/booking-wizard-service';
import {BookingStateService} from '@shared/services/booking-state-service';

@Component({
  selector: 'booking-for-what',
  imports: [],
  templateUrl: './for-what.component.html',
  styleUrl: './for-what.component.css',
})
export class ForWhat {
  private bookingWizardService = inject(BookingWizardService);
  private bookingStateService = inject(BookingStateService);

  isNew : boolean = this.bookingStateService.getAppointmentModel().isNewPatient!;
  newConsultations = signal<string[]>([])
  existingConsultations = signal<string[]>([])

  ngOnInit() {
    if (this.isNew) {
      this.newConsultations.set(this.bookingStateService.getDoctorModel().consultationType?.new ?? [])
    }
    else {
      this.existingConsultations.set(this.bookingStateService.getDoctorModel().consultationType?.existing ?? [])
    }
  }

  onSubmit(consultation: string){
    this.bookingStateService.updateAppointmentModel(({consultationType: consultation}))
    this.bookingWizardService.nextStep();
  }
}
