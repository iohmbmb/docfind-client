export enum AppointmentStatus {
  Pending,
  Confirmed,
  Cancelled
}

export interface Appointments {
  id?: string;
  patientId: string;
  doctorId: string;
  scheduleTime: string;
  status: AppointmentStatus
  symptoms: string;
}
