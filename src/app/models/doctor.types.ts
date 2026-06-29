import {User} from './user.types';

export interface Doctor extends User {
   specialty: string;
   hourlyRate: number;
}
