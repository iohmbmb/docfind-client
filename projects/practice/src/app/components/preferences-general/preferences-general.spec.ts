import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesGeneral } from './preferences-general';

describe('PreferencesGeneral', () => {
  let component: PreferencesGeneral;
  let fixture: ComponentFixture<PreferencesGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferencesGeneral],
    }).compileComponents();

    fixture = TestBed.createComponent(PreferencesGeneral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
