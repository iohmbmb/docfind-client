export enum AppointmentStatus {
  Pending,
  Confirmed,
  Cancelled
}

export interface Appointments {
  id?: string;
  patientId?: string;
  doctorId: string;
  scheduleTime: string;
  location: string;
  isNewPatient: boolean;
  status: AppointmentStatus
}
