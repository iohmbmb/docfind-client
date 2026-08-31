import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SearchComponent} from './searchbar';
import {provideRouter, Router} from '@angular/router';
import {By} from '@angular/platform-browser';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ReactiveFormsModule} from "@angular/forms";
import {LocationPreference} from '@shared/models/location-preference';
import {Availability} from '@shared/models/availability';
import {PracticeSpecialty} from '@shared/models/practice-specialty';
import {Doctor} from '@shared/models/doctor.types';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('Searchbar', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  const mockLocation = {
    id: 'loc-123',
    features: {
      geometry: {
        coordinates: [1.30, 4.56]
      },
      properties: {
        full_address: '123 NixOS Way, Dublin, Ireland',
        mapbox_id:"dXJuOm1ieHBsYzpEYVJO",
        feature_type:"place",
        context: {
          place: {
            name: 'Dublin',
          },
        },
      }
    }
  }

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    };
    await TestBed.configureTestingModule({
      imports: [SearchComponent,
        MatAutocompleteModule,
        ReactiveFormsModule,
      ],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    window.feather = undefined;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should launch search when the form is submitted', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(async () => true);
    const searchSpy = vi.spyOn(component, 'search');
    const formDebugElement = fixture.debugElement.query(By.css('form'));
    formDebugElement.triggerEventHandler('ngSubmit', null);
    expect(searchSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/search'],
      {
        "queryParams": {
          "address": "",
          "latitude": 0,
          "longitude": 0,
          "specialty": "",
        },
      },
    );
  })

  it('should set show specialties to true if focus or false if not', () => {
    expect(component.showSpecialties()).toBeFalsy();
    const inputElement = fixture.nativeElement.querySelector('[data-testid="specialty-input"]');
    inputElement.focus();
    expect(document.activeElement).toBe(inputElement);
    expect(component.showSpecialties()).toBeTruthy();
  })

  it('should create a dropdown for specialties when input is focused', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="specialty-dropdown"]')).toBeNull();
    const inputElement = fixture.nativeElement.querySelector('[data-testid="specialty-input"]');
    inputElement.focus();
    fixture.detectChanges();
    var specialtyDropdown = fixture.nativeElement.querySelector('[data-testid="specialty-dropdown"]');
    expect(specialtyDropdown).toBeTruthy();
  })

  it('should create a list of specialty buttons', () => {
    const inputElement = fixture.nativeElement.querySelector('[data-testid="specialty-input"]');
    inputElement.focus();
    fixture.detectChanges();
    var specialtyBtns = fixture.nativeElement.querySelectorAll('[data-testid="specialty-button"]');
    expect(specialtyBtns.length).toBe(18);
  })

  it('should select a specialty', () => {
    const selectSpecialty = vi.spyOn(component, 'selectSpecialty');
    expect(component.showSpecialties()).toBeFalsy();
    const inputElement = fixture.nativeElement.querySelector('[data-testid="specialty-input"]');
    inputElement.focus();
    fixture.detectChanges();
    expect(component.showSpecialties()).toBeTruthy();
    var specialtyBtns = fixture.nativeElement.querySelectorAll('[data-testid="specialty-button"]');
    specialtyBtns[3].dispatchEvent(new Event('mousedown'));
    expect(selectSpecialty).toHaveBeenCalled();
    expect(component.showSpecialties()).toBeFalsy();
  })

  it('should write a location to the subject', () =>{
    const inputSpy = vi.spyOn(component, 'onLocationInput');
    const locationInput = fixture.nativeElement.querySelector('[data-testid="location-input"]');
    locationInput.value = 'Toulouse';
    locationInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputSpy).toHaveBeenCalledWith('Toulouse');
  })

  it('should call selectLocation with the correct location object when an option is selected', () => {
    component.locations.set([mockLocation]);
    fixture.detectChanges();
    const selectSpy = vi.spyOn(component, 'selectLocation');
    const autocompleteDebugEl = fixture.debugElement.query(By.css('mat-autocomplete'));
    autocompleteDebugEl.triggerEventHandler('optionSelected', {
      option: {
        value: mockLocation
      }
    });
    expect(selectSpy).toHaveBeenCalledWith(mockLocation);
  });

  it('should show the spinner if isLoading', () =>{
    expect(fixture.nativeElement.querySelector('[data-testid="loading-spinner"]')).toBeFalsy();
    component.isLoading.set(true);
    fixture.detectChanges();
    const loading_spinner = fixture.nativeElement.querySelector('[data-testid="loading-spinner"]');
    expect(loading_spinner).not.toBeNull();
  })

  it('should display an error if isError', () =>{
    expect(fixture.nativeElement.querySelector('[data-testid="search-error"]')).toBeFalsy();
    component.isError.set(true);
    fixture.detectChanges();
    const search_error = fixture.nativeElement.querySelector('[data-testid="search-error"]');
    expect(search_error).not.toBeNull();
  })

  it('should display a list of doctors if doctors() is not empty', () =>{
    expect(fixture.nativeElement.querySelector('[data-testid="doctor-list"]')).toBeFalsy()
    var doc1 = {
      id: '2223',
      firstName:'doc',
      lastName:'doc',
      email:'valid-mail',
      practiceName:'practice',
      practiceAddress:'',
      practiceSuburb:'',
      practicePostcode:'',
      practicePhone:'',
      preference: LocationPreference.Hybrid,
      practiceState:'',
      hourlyRate: 20,
      status: Availability.Available,
      specialty: PracticeSpecialty.GeneralPractice}
    var doc2 = {
      id: 'doc-456',
      firstName:'doc2',
      lastName:'doc2',
      email:'valid-mail2',
      practiceName:'practice2',
      practiceAddress:'dd',
      practiceSuburb:'eee',
      practicePostcode:'eeee',
      practicePhone:'eeee',
      preference: LocationPreference.Remote,
      practiceState:'ssww',
      hourlyRate: 40,
      status: Availability.Available,
      specialty: PracticeSpecialty.GeneralPractice}
    const doctors: Doctor[] =  [doc1, doc2];
    component.doctors.set(doctors);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="doctor-list"]')).toBeTruthy()
    const docList = fixture.nativeElement.querySelectorAll('[data-testid="doctor-button"]');
    expect(docList.length).toEqual(2);
  })

  it('should click and call the book function', () =>{
    const spyBook = vi.spyOn(component, 'book');
    expect(fixture.nativeElement.querySelector('[data-testid="doctor-list"]')).toBeFalsy()
    var doc1 = {
      id: '2223',
      firstName:'doc',
      lastName:'doc',
      email:'valid-mail',
      practiceName:'practice',
      practiceAddress:'',
      practiceSuburb:'',
      practicePostcode:'',
      practicePhone:'',
      preference: LocationPreference.Hybrid,
      practiceState:'',
      hourlyRate: 20,
      status: Availability.Available,
      specialty: PracticeSpecialty.GeneralPractice}
    component.doctors.set([doc1]);
    fixture.detectChanges();
    const docBtn = fixture.nativeElement.querySelector('[data-testid="doctor-button"]');
    docBtn.click();
    expect(spyBook).toHaveBeenCalledWith(doc1);
  })

});
