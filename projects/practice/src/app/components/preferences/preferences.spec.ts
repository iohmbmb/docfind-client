import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Preferences } from './preferences';
import { PreferencesGeneral } from '../preferences-general/preferences-general';
import {Component} from '@angular/core';

declare global {
  interface Window {
    feather: {
      replace: () => void;
    } | undefined;
  }
}

@Component({
  selector: 'app-preferences-general',
  template: '',
  standalone: true
})
class MockPreferencesGeneralComponent { }

describe('Preferences', () => {
  let component: Preferences;
  let fixture: ComponentFixture<Preferences>;
  beforeEach(async () => {
    window.feather = {
    replace: () => {}
    }
    await TestBed.configureTestingModule({
      imports: [Preferences],
    }).overrideComponent(Preferences, {
      remove: { imports: [PreferencesGeneral] },
      add: { imports: [MockPreferencesGeneralComponent] }
    }).compileComponents();

    fixture = TestBed.createComponent(Preferences);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    window.feather = undefined;
    if (fixture) {
      fixture.destroy();
    }
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

