import {Availability} from '@shared/models/availability';
import {LocationPreference} from '@shared/models/location-preference';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {UserRole} from '@shared/models/user.types';
import {DayOfWeek, DoctorWorkHours} from '@shared/models/doctor-work.hours';

export interface DoctorProfileForm {
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  practiceName: string;
  practiceAddress: string;
  practiceSuburb: string
  practiceState: string
  practicePostcode: string
  practicePhone: string;
  biography?: string;
  hourlyRate: number;
  status: Availability
  preference: LocationPreference;
  specialty: PracticeSpecialty;
  absenceStartDate: string | null;
  absenceEndDate: string | null;
  workDays: DoctorWorkHours[];
}
