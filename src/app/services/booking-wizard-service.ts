import {effect, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingWizardService {

  private readonly WIZARD_KEY = 'booking_wizard_state';

  // The navigation state
  public currentStepIndex = signal<number>(
    this.loadFromStorage(this.WIZARD_KEY) ?? 0
  );

  constructor() {
    effect(() => {
      localStorage.setItem(this.WIZARD_KEY, JSON.stringify(this.currentStepIndex()));
    });
  }

  public nextStep() {
    this.currentStepIndex.update(idx => idx + 1);
  }

  public previousStep() {
    this.currentStepIndex.update(idx => idx - 1);
  }

  clearBookingState() {
    localStorage.removeItem(this.WIZARD_KEY);
  }

  private loadFromStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null; // Fallback to default state if JSON is corrupted
    }
  }
}
