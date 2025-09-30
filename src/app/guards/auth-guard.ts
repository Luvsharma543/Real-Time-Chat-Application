import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth-service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  if(inject(AuthService).isLoggedIn()){
    return true;
  }else{
    inject(Router).navigateByUrl("/login");
    return false;
  }
};
 
