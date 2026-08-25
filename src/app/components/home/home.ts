import {Component} from '@angular/core';
import {SearchComponent} from '../searchbar/searchbar';

@Component({
  selector: 'app-home',
  imports: [
    SearchComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
  })
export class HomeComponent {
}
