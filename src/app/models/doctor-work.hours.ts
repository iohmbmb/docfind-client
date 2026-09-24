
export interface DoctorWorkHours {
  id?: string,
  doctorId?: string,
  day: DayOfWeek,
  startTime: string,
  endTime: string,
  isMock: boolean
}

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}
