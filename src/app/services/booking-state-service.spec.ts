import { TestBed } from '@angular/core/testing';

import { BookingStateService } from './booking-state-service';
import {DayOfWeek, DoctorWorkHours} from '@shared/models/doctor-work.hours';
import {addMinutes, isBefore} from 'date-fns';

describe('BookingStateService', () => {
  let service: BookingStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clear booking state', () => {
    localStorage.setItem('booking_appointment_state', JSON.stringify({}));
    localStorage.setItem('booking_doctor_state', JSON.stringify({}));
    expect(localStorage.length).toEqual(2);
    service.clearBookingState();
    expect(localStorage.length).toEqual(0);
  })

  // TODO: It's convoluted, refactor it
  it('should update doctor working hours', () => {
    const mockWorkHours : DoctorWorkHours[] = [
      {
        id: 'valid-id',
        doctorId: 'valid-doc-id',
        day: DayOfWeek.Monday,
        startTime: '08:00',
        endTime: '18:00',
      },
      {
        id: 'valid-id',
        doctorId: 'valid-doc-id',
        day: DayOfWeek.Thursday,
        startTime: '08:00',
        endTime: '18:00',
      },
    ];
    const result : Date[] = [];
    const startHour : Date = service.parseTimeToDate(mockWorkHours[0].startTime);
    const endHour : Date = service.parseTimeToDate(mockWorkHours[0].endTime);
    let current : Date = startHour;
    while(isBefore(current, endHour)){
      result.push(new Date(current));
      current = addMinutes(current, 15);
    }
    result.push(endHour);

    service.updateDoctorWorkHours(mockWorkHours);
    expect(service.getDoctorWorkHours(DayOfWeek.Monday)).toEqual(result);
  })

  it('should convert day to day of week', () => {
    const day1 = service.convertDayToDayOfWeek(1);
    const day2 = service.convertDayToDayOfWeek(2);
    const day3 = service.convertDayToDayOfWeek(3);
    const day4 = service.convertDayToDayOfWeek(4);
    const day5 = service.convertDayToDayOfWeek(5);
    const dayDefault = service.convertDayToDayOfWeek(6);
    expect(day1).toEqual(DayOfWeek.Monday);
    expect(day2).toEqual(DayOfWeek.Tuesday);
    expect(day3).toEqual(DayOfWeek.Wednesday);
    expect(day4).toEqual(DayOfWeek.Thursday);
    expect(day5).toEqual(DayOfWeek.Friday);
    expect(dayDefault).toEqual(undefined);
  })
});
