import {effect, Injectable, signal} from '@angular/core';
import {Appointments, AppointmentStatus} from '@shared/models/appointment.types';
import {Doctor} from '@shared/models/doctor.types';
import {Availability} from '@shared/models/availability';
import {LocationPreference} from '@shared/models/location-preference';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {DoctorWorkHours} from '@shared/models/doctor-work.hours';

@Injectable({
  providedIn: 'root',
})
export class BookingStateService {

  private readonly APPOINTMENT_KEY = 'booking_appointment_state';
  private readonly DOCTOR_KEY = 'booking_doctor_state';

  private appointmentModel = signal<Appointments>(
    this.loadFromStorage(this.APPOINTMENT_KEY) ?? {
    patientId: '',
    doctorId:'',
    scheduleTime:'',
    location:'',
    isNewPatient:true,
    isForSomeone:false,
    consultationType:'',
    status: AppointmentStatus.Pending,
  });

  private doctorModel = signal<Doctor>(
    this.loadFromStorage(this.DOCTOR_KEY) ?? {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      practiceName: '',
      practiceAddress: '',
      practiceSuburb: '',
      practiceState: '',
      practicePostcode: '',
      practicePhone: '',
      biography: '',
      hourlyRate: 0,
      status: Availability.Available,
      preference: LocationPreference.Hybrid,
      specialty: PracticeSpecialty.GeneralPractice,
      consultationType: {
        new: [],
        existing: [],
      },
    });

  private doctorWorkHours = signal<DoctorWorkHours[]>([]);

  constructor() {
    effect(() => {
      localStorage.setItem(this.APPOINTMENT_KEY, JSON.stringify(this.appointmentModel()));
    });

    effect(() => {
      localStorage.setItem(this.DOCTOR_KEY, JSON.stringify(this.doctorModel()));
    });

    this.appointmentModel.update(model => ({
      ...model,
      doctorId: this.doctorModel().id!,
      patientId: localStorage.getItem('user_id')!,
    }))
  }

  getAppointmentModel() {
    return this.appointmentModel();
  }
  getDoctorModel() {
    return this.doctorModel();
  }

  getDoctorNextWorkDays() {
    const date : Date[] = [];
    const days = [...new Set(this.doctorWorkHours().map(workHours => workHours.day))]
    for (const day of days) {
      switch (day) {
        case 'Monday':
          date.push(this.getNextWeekday(1));
          break;
          case 'Tuesday':
            date.push(this.getNextWeekday(2));
            break;
            case 'Wednesday':
              date.push(this.getNextWeekday(3));
              break;
              case 'Thursday':
                date.push(this.getNextWeekday(4));
                break;
                  case 'Friday':
                    date.push(this.getNextWeekday(5));
                    break;

      }
    }
    return date.sort((a, b) => a.getTime() - b.getTime());
  }

  patientId() {
    return localStorage.getItem('user_id')!;
  }

  updateAppointmentModel(patch: Partial<Appointments>) {
    this.appointmentModel.update(model => ({ ...model, ...patch }));
  }
  updateDoctorModel(patch: Partial<Doctor>) {
    this.doctorModel.update(model => ({ ...model, ...patch }));
  }

  updateDoctorWorkHours(hours: DoctorWorkHours[]) {
    this.doctorWorkHours.set(hours);
  }

  clearBookingState() {
    localStorage.removeItem(this.APPOINTMENT_KEY);
    localStorage.removeItem(this.DOCTOR_KEY);
  }

  private getNextWeekday(targetDay: number): Date {
    const today = new Date();
    const result = new Date(today);

    let daysToAdd = (targetDay - today.getDay() + 7) % 7;
    if (daysToAdd === 0) {
      daysToAdd = 7;
    }

    result.setDate(today.getDate() + daysToAdd);
    return result;
  }


  private loadFromStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null; // Fallback to default state if JSON is corrupted
    }
  }

}
