import {AfterViewInit, Component, computed, inject, signal} from '@angular/core';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {Availability} from '@shared/models/availability';
import {LocationPreference} from '@shared/models/location-preference';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar'
import {MatDialog} from '@angular/material/dialog';
import {UpdatePassword} from '../update-password/update-password';
import {MatDatepickerModule,} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AuthService} from '@shared/services/auth.service';
import {UserService} from '@shared/services/user.service';
import {Doctor} from '@shared/models/doctor.types';
import {UnavailabilityPeriod} from '@shared/models/unavailability-period.types';
import {ScheduleService} from '@shared/services/schedule';
import {formatDate} from '@angular/common';
import {DayOfWeek, DoctorWorkHours} from '@shared/models/doctor-work.hours';
import {UserRole} from '@shared/models/user.types';
import {form, FormField, submit} from '@angular/forms/signals';
import {DoctorProfileForm} from '@shared/models/doctor-profile-form';
import {firstValueFrom} from 'rxjs';

declare var feather : any;

@Component({
  selector: 'app-preferences-general',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormField
  ],
  templateUrl: './preferences-general.html',
  styleUrl: './preferences-general.css',
  providers: [provideNativeDateAdapter()],
})

export class PreferencesGeneral implements  AfterViewInit {
  authService = inject(AuthService)
  userService = inject(UserService)
  scheduleService = inject(ScheduleService)
  private snackBar : MatSnackBar = new MatSnackBar()
  private dialog : MatDialog = new MatDialog()


  specialties = Object.values(PracticeSpecialty)
  statuses = Object.values(Availability)
  locations = Object.values(LocationPreference)

  readonly days = Object.values(DayOfWeek)

  doctor_id : string = '';
  error_message = signal<string>('')

  public doctorProfileModel = signal<DoctorProfileForm>({
    email : '',
    passwordHash: '',
    firstName : '',
    lastName :'',
    role : UserRole.doctor,
    practiceName: '',
    practiceAddress: '',
    practiceSuburb: '',
    practiceState: '',
    practicePostcode: '',
    practicePhone: '',
    biography: '',
    hourlyRate: 0.0,
    specialty: PracticeSpecialty.GeneralPractice,
    status: Availability.Available,
    preference: LocationPreference.Hybrid,
    absenceStartDate: '',
    absenceEndDate: '',
    workDays: [{
      day: DayOfWeek.Monday,
      startTime: '09:00',
      endTime: '5:00'
    }],
  });

  public doctorProfileForm = form(this.doctorProfileModel);

  async ngOnInit() {
    try {
      const doctorId = await firstValueFrom(this.authService.getId());

      this.doctor_id = doctorId.id;

      const doctor = await firstValueFrom(
        this.userService.getDoctor(doctorId.id)
      );

      this.doctorProfileModel.update(model => ({
        ...model,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        practiceName: doctor.practiceName,
        practiceAddress: doctor.practiceAddress,
        practicePhone: doctor.practicePhone,
        practicePostcode: doctor.practicePostcode,
        practiceState: doctor.practiceState,
        practiceSuburb: doctor.practiceSuburb,
        hourlyRate: doctor.hourlyRate,
        specialty: doctor.specialty,
        status: doctor.status,
        preference: doctor.preference
      }));

      const workHours = await firstValueFrom(
        this.scheduleService.getWorkHours(this.doctor_id)
      );

      this.doctorProfileModel.update(model => ({
        ...model,
        workDays: workHours.map(h => this.createWorkingHour(h))
      }));

      if (doctor.status === Availability.Away) {
        const period = await firstValueFrom(
          this.scheduleService.getAbsence(this.doctor_id)
        );

        if (period.startDate && period.endDate) {
          this.doctorProfileModel.update(model => ({
            ...model,
            absenceStartDate: period.startDate,
            absenceEndDate: period.endDate
          }));
        }
      }

      setTimeout(() => feather.replace());

    } catch (err) {
      console.error('Error loading doctor profile:', err);
    }
  }

  ngAfterViewInit() {
    feather.replace();
  }

  public onChangePassword() {
    this.dialog.open(UpdatePassword, {
      height: '240px',
      width: '600px'
    })
  }

  public onSave() {
    submit(this.doctorProfileForm, async () => {
      const model = this.doctorProfileModel();
      if (
        model.status === Availability.Away &&
        (!model.absenceStartDate || !model.absenceEndDate)
      ) {
        this.error_message.set('Please provide an absence period.');
        return;
      }
      const startDate = model.absenceStartDate!;
      const endDate = model.absenceEndDate!;
      const updatedDoc = this.createDoctorProfilePayload(model)
      const workHours: DoctorWorkHours[] = this.createWorkHoursPayload(model)

      try {
        await Promise.all([
          firstValueFrom(this.userService.updateDoctor(this.doctor_id, updatedDoc)),
          firstValueFrom(this.scheduleService.createUpdateWorkHours(this.doctor_id, workHours)),
        ])

        if(model.status === Availability.Away){
          const absencePeriod:UnavailabilityPeriod = {
            startDate: formatDate(startDate, 'yyyy-MM-dd', 'en-US'),
            endDate: formatDate(endDate, 'yyyy-MM-dd', 'en-US')
          }
          await firstValueFrom(this.scheduleService.createUpdateAbsence(this.doctor_id, absencePeriod))
        }
        this.snackBar.open('Changes saved', '', {duration: 2000});
      }
      catch(err) {
        this.error_message.set('Error updating the profile.');
        console.error('Error updating doctor profile:', err);
      }
    })
  }

  formatSpecialty(value: string): string {
    return value.replace(/([A-Z])/g, ' $1').trim();
  }

  readonly isAway= computed(() =>
    this.doctorProfileModel().status === Availability.Away
  );

  updateWorkDay(index: number, changes: Partial<DoctorWorkHours>) {
    this.doctorProfileModel.update(model => ({
      ...model,
      workDays: model.workDays.map((hour, i) =>
        i === index
          ? { ...hour, ...changes }
          : hour
      )
    }));
  }

  updateLocation(location: LocationPreference) {
    this.doctorProfileModel.update(model => ({
      ...model,
      location
    }))
  }

  updateSpecialty(specialty: PracticeSpecialty) {
    this.doctorProfileModel.update(model => ({
      ...model,
      specialty
    }));
  }

  addWorkingHour() {
    const days = Object.values(DayOfWeek)

    const model = this.doctorProfileModel()
    const last = model.workDays.at(model.workDays.length - 1);
    const nextDay = last
      ? days[(days.indexOf(last.day) + 1) % days.length]
      : DayOfWeek.Monday;

    this.doctorProfileModel.update(model => ({
      ...model,
      workDays: [
        ...model.workDays,
        {
          day: nextDay as DayOfWeek,
          startTime: '09:00',
          endTime: '17:00'
        }
      ]
    }));
    setTimeout(() => feather.replace());
  }

  removeWorkingHour(index: number) {
    this.doctorProfileModel.update(model => ({
      ...model,
      workDays: model.workDays.filter((_, i) => i !== index)
    }));
    setTimeout(() => feather.replace());
  }

  private createWorkingHour(hour?: Partial<DoctorWorkHours>): DoctorWorkHours {
    return {
      day: hour?.day ?? DayOfWeek.Monday,
      startTime: hour?.startTime ?? '09:00',
      endTime: hour?.endTime ?? '17:00',
    };
  }

  private createDoctorProfilePayload(model: DoctorProfileForm):Doctor{
    return {
      firstName: model.firstName,
      lastName: model.lastName,
      email: model.email,
      hourlyRate: model.hourlyRate,
      practicePhone: model.practicePhone,
      practicePostcode: model.practicePostcode,
      practiceState: model.practiceState,
      practiceSuburb: model.practiceSuburb,
      practiceAddress: model.practiceAddress,
      practiceName: model.practiceName,
      preference: model.preference,
      status: model.status,
      specialty: model.specialty,
    }
  }

  private createWorkHoursPayload(model: DoctorProfileForm): DoctorWorkHours[]{
    return model.workDays.map(wh => ({
      day: wh.day,
      startTime: wh.startTime,
      endTime: wh.endTime,
    }));
  }
}
