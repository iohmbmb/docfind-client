import {User} from './user.types';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {Availability} from '@shared/models/availability';
import {LocationPreference} from '@shared/models/location-preference';

export interface Doctor extends User {
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
  specialty?: PracticeSpecialty;
}
