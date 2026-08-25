import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingFormComponent } from './bookingform';
import {provideRouter} from '@angular/router';
import {By} from '@angular/platform-browser';
import {ForWho} from './forwho/for-who.component';
import { ForNew } from "./fornew/for-new.component";
import {ForWhat} from "./forwhat/for-what.component";
import {BookingSummary} from './booking-summary/booking-summary';
import { ForWhen } from "./forwhen/for-when.component";
import { BookingStateService } from "@shared/services/booking-state-service";

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('Bookingform', () => {
  let component: BookingFormComponent;
  let fixture: ComponentFixture<BookingFormComponent>;

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    }

    await TestBed.configureTestingModule({
      imports: [BookingFormComponent],
      providers: [provideRouter([]), BookingStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    window.feather = undefined;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch between components', () => {
    component.currentStepIndex.set(0);
    fixture.detectChanges()

    const who_step = fixture.debugElement.query(By.directive(ForWho));
    expect(who_step).toBeTruthy();

    component.currentStepIndex.set(1);
    fixture.detectChanges()
    const new_step = fixture.debugElement.query(By.directive(ForNew));
    expect(new_step).toBeTruthy();

    component.currentStepIndex.set(2);
    fixture.detectChanges()
    const what_step = fixture.debugElement.query(By.directive(ForWhat));
    expect(what_step).toBeTruthy();

    component.currentStepIndex.set(3);
    fixture.detectChanges();
    const when_step = fixture.debugElement.query(By.directive(ForWhen));
    expect(when_step).toBeTruthy();

    component.currentStepIndex.set(4);
    fixture.detectChanges();
    const summary_step = fixture.debugElement.query(By.directive(BookingSummary));
    expect(summary_step).toBeTruthy();
  })

  it('should go back to the previous step', () =>{
    component.currentStepIndex.set(2);
    fixture.detectChanges();

    const previousBtn = fixture.debugElement.query(By.css('[data-testid="btn-previous"]')).nativeElement;

    previousBtn.click();
    fixture.detectChanges();
    expect(component.currentStepIndex()).toBe(1);
  })

  it('should move to the next step', () =>{
    component.currentStepIndex.set(2);
    fixture.detectChanges();
    const nextBtn = fixture.debugElement.query(By.css('[data-testid="btn-next"]')).nativeElement;
    nextBtn.click();
    fixture.detectChanges();
    expect(component.currentStepIndex()).toBe(3);
  })

  it('should have the invisible class if isSelected is false', () =>{
    const service = TestBed.inject(BookingStateService);
    vi.spyOn(service, 'isSelected').mockReturnValue(false);
    component.currentStepIndex.set(0);
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(By.css('[data-testid="btn-next"]')).nativeElement;
    expect(nextButton.classList.contains('invisible')).toBe(true);
  })

  it('should have the invisible class if index is 4', () =>{
    const service = TestBed.inject(BookingStateService);
    vi.spyOn(service, 'isSelected').mockReturnValue(false);
    component.currentStepIndex.set(4);
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(By.css('[data-testid="btn-next"]')).nativeElement;
    expect(nextButton.classList.contains('invisible')).toBe(true);
  })

  it('should NOT have the invisible class if index is not 4 and isSelected true', () =>{
    const service = TestBed.inject(BookingStateService);
    vi.spyOn(service, 'isSelected').mockReturnValue(true);
    component.currentStepIndex.set(2);
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(By.css('[data-testid="btn-next"]')).nativeElement;
    expect(nextButton.classList.contains('invisible')).toBe(false);
  })
});
