import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForNew } from './for-new.component';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('ForNew', () => {
  let component: ForNew;
  let fixture: ComponentFixture<ForNew>;

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    };
    await TestBed.configureTestingModule({
      imports: [ForNew],
    }).compileComponents();

    fixture = TestBed.createComponent(ForNew);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    window.feather = undefined;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
