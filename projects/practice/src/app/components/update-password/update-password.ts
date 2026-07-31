import {AfterViewInit, Component, inject} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '@shared/services/auth.service';
import {PasswordRequest} from '@shared/models/password-request.types';
import {MatSnackBar} from '@angular/material/snack-bar';

declare var feather : any;

@Component({
  selector: 'app-update-password',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './update-password.html',
  styleUrl: './update-password.css',
})
export class UpdatePassword implements AfterViewInit {
  authService = inject(AuthService)
  isMatch: boolean = true
  isError: boolean = false
  private snackBar : MatSnackBar = new MatSnackBar()

  updatePassForm = new FormGroup({
    currentPassword: new FormControl('', {nonNullable: true}),
    newPassword: new FormControl('', {nonNullable: true}),
    confirmNewPassword: new FormControl('', {nonNullable: true})
  })

  constructor(public dialogRef: MatDialogRef<UpdatePassword>) { }
  ngAfterViewInit() {
    feather.replace();
  }

  public close(){
    this.dialogRef.close()
  }

  public updatePassword(){
    if(this.updatePassForm.valid){
      const updatePassData = this.updatePassForm.getRawValue();
      if(updatePassData.newPassword === updatePassData.confirmNewPassword){
        const request :  PasswordRequest = {
          currentPassword: updatePassData.currentPassword,
          newPassword: updatePassData.confirmNewPassword
        }
        this.authService.updatePassword(request).subscribe({
          next: value => {
            this.snackBar.open('Password updated', '', {duration: 2000});
            this.close()
          },
          error: err => {
            this.isError = true
            console.log("Could not update the password.", err)
          }
        })
      }
      else {
        this.isMatch = false
      }
    }
  }
}
