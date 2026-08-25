import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForWho } from './for-who.component';
import {provideRouter} from '@angular/router';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('Forwho', () => {
  let component: ForWho;
  let fixture: ComponentFixture<ForWho>;

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    };
    await TestBed.configureTestingModule({
      imports: [ForWho],
    }).compileComponents();

    fixture = TestBed.createComponent(ForWho);
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
