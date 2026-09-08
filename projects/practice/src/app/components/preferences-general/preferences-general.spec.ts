import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreferencesGeneral } from './preferences-general';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('PreferencesGeneral', () => {
  let component: PreferencesGeneral;
  let fixture: ComponentFixture<PreferencesGeneral>;

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    }

    await TestBed.configureTestingModule({
      imports: [PreferencesGeneral],
    }).compileComponents();

    fixture = TestBed.createComponent(PreferencesGeneral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    window.feather = undefined;
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
