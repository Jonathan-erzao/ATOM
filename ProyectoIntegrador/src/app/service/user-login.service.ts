import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  userLoginOn = false;

  constructor() { }

  setUserLoggedIn() {
    this.userLoginOn = true;
  }

  setUserLoggedOut() {
    this.userLoginOn = false;
  }
}

