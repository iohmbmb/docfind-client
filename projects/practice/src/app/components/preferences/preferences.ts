import {Component} from '@angular/core';
import {PreferencesGeneral} from '../preferences-general/preferences-general';
import { Demobar } from '../demobar/demobar';

@Component({
  selector: 'app-preferences',
  imports: [
    PreferencesGeneral,
    Demobar
  ],
  templateUrl: './preferences.html',
  styleUrl: './preferences.css',
})
export class Preferences {
  public selectedButton: string = 'general';
}
