import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../Models/user';
import { tap } from 'rxjs/operators';
import { UserDto } from '../Models/userDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId: string | null =""
  
     user: UserDto={
      id:"",
      profileImage:"",
      fullName:"",
      email:"",
      userName:"",
    };

  private baseUrl = "https://localhost:5000/api/Account"; // Replace with your backend URL

 constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }



  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  register(formData: FormData): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/register`, formData);
  }

  getDecodedToken(): any{
      const token = this.getToken();   
      if(token){
        return this.jwtHelper.decodeToken(token);
      }
      return null;
    }
  

  saveToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  }



// Current Logged in User getting process

getUserIdFromToken(): string | null {
  const decoded = this.getDecodedToken();
  return decoded ? decoded["nameid"] || decoded["sub"] : null; 
}

getCurrentUser(userId: string): Observable<any> {
  console.log("Fetching user with ID:", userId);
  return this.http.get<any>(`${this.baseUrl}/currentuser/${userId}`);
}


 saveCurrentUser() {
  const userId = this.getUserIdFromToken();  
  if (!userId) return;

  this.getCurrentUser(userId).subscribe({
    next: (res) => {
      const userData: UserDto = {
        id: res.id,
        profileImage: res.profileImage,
        fullName: res.fullName,
        email: res.email,
        userName: res.userName,
      };
      this.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
    },
    error: (err) => {
      console.error("API Error:", err);
    }
  });
}

get currentLoggedUser():UserDto|null
{
  const user:UserDto|null=JSON.parse(localStorage.getItem("user")!);
  return user;

}
}