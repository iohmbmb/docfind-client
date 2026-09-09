import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Preferences } from './preferences';
import { NO_ERRORS_SCHEMA } from "@angular/core";

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
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Preferences);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach( async () => {
    window.feather = undefined;
    await new Promise(resolve => setTimeout(resolve, 0));
    if (fixture) {
      fixture.destroy();
    }
  })

  it('should create', async () => {
    expect(component).toBeTruthy();
  });
});
