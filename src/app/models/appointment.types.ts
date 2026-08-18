export enum AppointmentStatus {
  Pending,
  Confirmed,
  Cancelled
}

export interface Appointments {
  id?: string;
  patientId: string;
  doctorId: string;
  scheduleTime: Date;
  location?: string;
  isNewPatient?: boolean;
  isForSomeone?: boolean;
  consultationType?: string;
  status?: AppointmentStatus
}
