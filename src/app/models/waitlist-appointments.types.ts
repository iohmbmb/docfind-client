import {Appointments} from '@shared/models/appointment.types';

export interface WaitlistAppointments {
  id?: string;
  doctorId: string;
  appointment?: Appointments
}
