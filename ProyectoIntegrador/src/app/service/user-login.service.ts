import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  userLoginOn: boolean = false;

  constructor() { }

  setUserLoggedIn() {
    this.userLoginOn = true;
  }

  setUserLoggedOut() {
    this.userLoginOn = false;
  }
}

