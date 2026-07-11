import { Component } from '@angular/core';

@Component({
  selector: 'app-forwhoform',
  imports: [],
  templateUrl: './forwhoform.html',
  styleUrl: './forwhoform.css',
})
export class Forwhoform {
  public isNewPatient: boolean = false;
  public onSubmit(isNew: boolean){
    this.isNewPatient = isNew;
  };
}
