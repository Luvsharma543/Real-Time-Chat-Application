import { Component, inject } from '@angular/core';
import { AuthService } from '../Services/auth-service';
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatInputModule} from "@angular/material/input"
import {MatButtonModule} from "@angular/material/button"
import {MatIconModule} from "@angular/material/icon"
import {MatSnackBar} from "@angular/material/snack-bar"
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';




@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule,MatInputModule,FormsModule,MatButtonModule,MatIconModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email!: string 
  password!: string 

  authService=inject(AuthService);
  snackBar=inject(MatSnackBar);
  router=inject(Router);

  onLogin() {
          console.log("user logged in method called")
    this.authService.login({ email: this.email, password: this.password }).subscribe({

      
      next: (res) => {  
        this.snackBar.open(res.message||"User Logged In Successfully", "Close",{duration: 3000});
        this.authService.saveToken(res.token);
        this.authService.saveCurrentUser();
        this.router.navigateByUrl("/chat");
      }
      ,
      error: (err) => {
        this.snackBar.open("Something went wrong", "Close",{duration: 3000});
      },
      // complete:()=>{
      //   this.router.navigateByUrl("");
      // },
    });
  }

}
