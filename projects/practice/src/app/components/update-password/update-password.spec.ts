import { ComponentFixture, TestBed } from '@angular/core/testing';
import {MatDialogRef} from '@angular/material/dialog';
import { UpdatePassword } from './update-password';
import {provideRouter} from '@angular/router';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

describe('UpdatePassword', () => {
  let component: UpdatePassword;
  let fixture: ComponentFixture<UpdatePassword>;

  beforeEach(async () => {
    window.feather = {
      replace: () =>{}
    }

    await TestBed.configureTestingModule({
      imports: [UpdatePassword],
      providers: [provideRouter([]), {provide: MatDialogRef, useValue: {}}]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatePassword);
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
