import {Component, Signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {PracticeSpecialty} from '@shared/models/practice-specialty';

@Component({
  selector: 'app-searchbar',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css',
})
export class SearchComponent {
  public datalist: Array<any> = [];

  constructor() {
    this.datalist = [
      {id: 0, name: PracticeSpecialty[PracticeSpecialty.GeneralPractice]},
      {id: 1, name: PracticeSpecialty[PracticeSpecialty.Physiotherapy]},
      {id: 2, name: PracticeSpecialty[PracticeSpecialty.Dentistry]},
      {id: 3, name: PracticeSpecialty[PracticeSpecialty.Radiology]},
      {id: 4, name: PracticeSpecialty[PracticeSpecialty.Podiatry]},
      {id: 5, name: PracticeSpecialty[PracticeSpecialty.Optometry]},
      {id: 6, name: PracticeSpecialty[PracticeSpecialty.Chiropractor]},
      {id: 7, name: PracticeSpecialty[PracticeSpecialty.Osteopathic]},
      {id: 8, name: PracticeSpecialty[PracticeSpecialty.Dietitian]},
      {id: 9, name: PracticeSpecialty[PracticeSpecialty.Nutritionist]},
      {id: 10, name: PracticeSpecialty[PracticeSpecialty.Surgeon]},
      {id: 11, name: PracticeSpecialty[PracticeSpecialty.Cardiology]},
      {id: 12, name: PracticeSpecialty[PracticeSpecialty.Neurology]},
      {id: 13, name: PracticeSpecialty[PracticeSpecialty.Orthopedics]},
      {id: 14, name: PracticeSpecialty[PracticeSpecialty.Pediatrics]},
      {id: 15, name: PracticeSpecialty[PracticeSpecialty.Psychology]},
      {id: 16, name: PracticeSpecialty[PracticeSpecialty.Psychiatry]},
      {id: 17, name: PracticeSpecialty[PracticeSpecialty.Urology]}
    ];
  }
}
