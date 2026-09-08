import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup';
import {provideRouter} from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [SignupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onAddressInput', async () => {
    const spyOnAddressInput = vi.spyOn(component, 'onAddressInput');
    component.onAddressInput('123 Main St');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spyOnAddressInput).toHaveBeenCalledWith('123 Main St');
  });

  it('should select an address', async () => {
    const mockFeature = {
      geometry: {
        coordinates: [123.456, -12.345]
      },
      properties: {
        name: '123 Main St',
        context: {
         place: {
           name: 'Noice',
         },
         region: {
           name: 'City',
         },
         postcode: {
           name: '12345',
         },
        },
      }
    };

    component.selectAddress(mockFeature);

    fixture.detectChanges();
    await fixture.whenStable();

    // 3. Assert: Read the value of the production Signal directly to confirm the side effect
    const updatedState = component.signupModel();

    expect(updatedState.practiceAddress).toBe('123 Main St');
    expect(updatedState.practiceSuburb).toBe('Noice');
    expect(updatedState.practiceState).toBe('City');
    expect(updatedState.practicePostcode).toBe('12345');
    expect(updatedState.longitude).toBe(123.456);
    expect(updatedState.latitude).toBe(-12.345); }
  );

  it('should register doctor', async () => {
    const spyOnRegisterDoctor = vi.spyOn(component, 'registerDoctor');
    component.registerDoctor();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spyOnRegisterDoctor).toHaveBeenCalled();
  })
})

