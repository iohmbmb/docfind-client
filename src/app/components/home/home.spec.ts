import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home';
import {provideRouter} from '@angular/router';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    };
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
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
