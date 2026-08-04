import {Component, inject, signal} from '@angular/core';
import {ForWho} from './forwho/for-who.component';
import {firstValueFrom} from 'rxjs';
import {AppointmentService} from '@shared/services/appointment.service';
import {ForNew} from './fornew/for-new.component';
import {ForWhat} from './forwhat/for-what.component';
import {ForWhen} from './forwhen/for-when.component';
import {BookingWizardService} from '@shared/services/booking-wizard-service';
import {BookingStateService} from '@shared/services/booking-state-service';

declare var feather: any

type StepIdentifier = 'WHO' | 'WHERE' | 'WHAT' | 'WHEN';

interface WizardStep {
  id: StepIdentifier;
  label: string;
}

const STEPS_CONFIG: WizardStep[] = [
  { id: 'WHO', label: 'Who' },
  { id: 'WHERE', label: 'Where' },
  { id: 'WHAT', label: 'What' },
  { id: 'WHEN', label: 'When' },
];

@Component({
  selector: 'app-booking-form',
  imports: [
    ForWho,
    ForNew,
    ForWhat,
    ForWhen,
  ],
  templateUrl: './bookingform.html',
  styleUrl: './bookingform.css',
})
export class BookingFormComponent {

  private appointmentService = inject(AppointmentService);
  private bookingStateService = inject(BookingStateService);
  public bookingWizardService = inject(BookingWizardService);

  currentStepIndex = this.bookingWizardService.currentStepIndex;
  appointment= this.bookingStateService.getAppointmentModel();
  doctor=  this.bookingStateService.getDoctorModel();

  ngOnInit() {
    this.appointment.patientId = this.bookingStateService.patientId();
    this.appointment.location = this.doctor.practiceAddress+', '
      + this.doctor.practiceSuburb+', '
      + this.doctor.practiceState+', '
      + this.doctor.practicePostcode;
  }

  ngAfterViewInit() {
    feather.replace();
  }

  private errorMessage = signal<string>('');

  public async onSubmit() {
    this.errorMessage.set('')
    try {
      await firstValueFrom(this.appointmentService.createAppointment(this.appointment))
    } catch(err) {
      this.errorMessage.set('Failed to create appointment');
      console.log(err)
    }
  }

  formatSpecialty(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').trim();
  }
  protected readonly STEPS_CONFIG = STEPS_CONFIG;
}
