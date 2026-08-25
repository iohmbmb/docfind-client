import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForWhen } from './for-when.component';
import {BookingStateService} from '@shared/services/booking-state-service';
import {of} from 'rxjs';
import {By} from '@angular/platform-browser';
import {DayOfWeek} from '@shared/models/doctor-work.hours';
import {signal} from '@angular/core';

describe('Forwhenform', () => {
  let component: ForWhen;
  let fixture: ComponentFixture<ForWhen>;
  let mockBookingStateService: any;
  let tomorrow = new Date(Date.now() + 86400000);
  let tomorrow_2 = new Date(Date.now() + 86400000);
  let afterTomorrow = new Date( Date.now() + (86400000*2));
  let afterTomorrow_2 = new Date( Date.now() + (86400000*2));

  beforeEach(async () => {
    tomorrow.setHours(9, 0, 0, 0);
    tomorrow_2.setHours(9, 15, 0, 0);
    afterTomorrow.setHours(14, 0, 0, 0);
    afterTomorrow_2.setHours(14, 15, 0, 0);

    mockBookingStateService = {
      getDoctorNextWorkDays: () => [
        tomorrow,
        afterTomorrow
      ],
      convertDayToDayOfWeek: (day: number) => {
        switch(day){
          case 1:
            return DayOfWeek.Monday;
          case 2:
            return DayOfWeek.Tuesday;
          case 3:
            return DayOfWeek.Wednesday;
          case 4:
            return DayOfWeek.Thursday;
          case 5:
            return DayOfWeek.Friday;
          default:
            return undefined
        }
      },
      getDoctorWorkHours: (day: DayOfWeek | undefined) => [
        tomorrow,
        tomorrow_2,
        afterTomorrow,
        afterTomorrow_2
      ],
      isTimeSelected: (date: Date, hour:Date) => false,
      selectedAppointment: signal<Date | undefined>(undefined),
      updateAppointmentModel: (date: Date) => {},
    }
    await TestBed.configureTestingModule({
      imports: [ForWhen],
      providers: [{provide: BookingStateService, useValue: mockBookingStateService}]
    }).compileComponents();
    fixture = TestBed.createComponent(ForWhen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can create expansion panel', () => {
    component.ngOnInit();
    const days = component.days;
    expect(days().length).toBe(2);
  })

  it('cannot create expansion panel', () => {
    component.ngOnInit();
    const days = component.days;
    days.set([])
    expect(days().length).toBe(0);
  })

  it('should create multiple expansion panel', () => {
    component.ngOnInit();
    const expansionPanel = fixture.nativeElement.querySelectorAll('mat-expansion-panel');
    expect(expansionPanel.length).toEqual(2);
  });

  it('should have two expansion panel and 8 times', () => {
    component.ngOnInit();
    const containers = fixture.nativeElement.querySelectorAll('[data-testid="container-time"]');
    expect(containers.length).toEqual(2)
    const times = fixture.nativeElement.querySelectorAll('[data-testid="time"]');
    expect(times.length).toEqual(8)
  })

  it('should select an appointment time', () => {
    component.ngOnInit()
    const onSelectBtns = fixture.nativeElement.querySelectorAll('[data-testid="time-button"]');
    onSelectBtns[0].click();
    fixture.detectChanges();
    expect(mockBookingStateService.selectedAppointment()).toStrictEqual(tomorrow);
  })

});
