import {Component} from '@angular/core';
import {SearchComponent} from '../searchbar/searchbar';
import { Demobar } from '../demobar/demobar';

@Component({
  selector: 'app-home',
  imports: [
    SearchComponent,
    Demobar
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  })
export class HomeComponent {
}
