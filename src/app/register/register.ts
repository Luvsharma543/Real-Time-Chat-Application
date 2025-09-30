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
  selector: 'app-register',
  imports: [MatFormFieldModule,MatInputModule,FormsModule,MatButtonModule,MatIconModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
     
  email!: string 
  password!: string 
  fullName!: string 
  profilePicture:string="https://randomuser.me/api/portraits/lego/5.jpg"
  profileImage?:File
 

  authService=inject(AuthService);
  snackBar=inject(MatSnackBar);
  router=inject(Router);



  // register.ts
onRegister() {


  const formData = new FormData();
  formData.append("Email", this.email);
  formData.append("Password", this.password);
  formData.append("FullName", this.fullName);
  formData.append("UserName", this.email); 
  if (this.profileImage) {
    formData.append("ProfileImage", this.profileImage);
  }

  this.authService.register(formData).subscribe({
    next: (res) => {
      this.snackBar.open(res.message||"User Registered Successfully", "Close");
    },
    error: (err) => {
      this.snackBar.open("Something went wrong", "Close" ,{duration: 3000});
    },
    complete:()=>{
      this.router.navigateByUrl("/login");
    }
  });
}


  onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.profileImage = file;

    // File ko base64 me convert karke image show karenge
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilePicture = e.target.result; // preview ke liye
    };
    reader.readAsDataURL(file);
  }
}

}
