import {UserRole} from './user.types';
import {Availability} from '@shared/models/availability';
import {LocationPreference} from '@shared/models/location-preference';
import {PracticeSpecialty} from '@shared/models/practice-specialty';

export interface UserRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface DoctorRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  practiceName: string;
  practiceAddress: string;
  practiceSuburb: string
  practiceState: string
  practicePostcode: string
  practicePhone: string;
  biography?: string;
  hourlyRate: number;
  status?: Availability
  preference?: LocationPreference;
  specialty: PracticeSpecialty;
}
