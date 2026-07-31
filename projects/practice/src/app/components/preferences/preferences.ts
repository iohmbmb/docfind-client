import {Component} from '@angular/core';
import {PreferencesGeneral} from '../preferences-general/preferences-general';

@Component({
  selector: 'app-preferences',
  imports: [
    PreferencesGeneral,
  ],
  templateUrl: './preferences.html',
  styleUrl: './preferences.css',
})
export class Preferences {
  public selectedButton: string = 'general';
}
