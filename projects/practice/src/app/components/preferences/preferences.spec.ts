import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Preferences } from './preferences';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('Preferences', () => {
  let component: Preferences;
  let fixture: ComponentFixture<Preferences>;

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    }

    await TestBed.configureTestingModule({
      imports: [Preferences],
    }).compileComponents();

    fixture = TestBed.createComponent(Preferences);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach( async () => {
    window.feather = undefined;
    await new Promise(resolve => setTimeout(resolve, 20));
    if (fixture) {
      fixture.destroy();
    }
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
