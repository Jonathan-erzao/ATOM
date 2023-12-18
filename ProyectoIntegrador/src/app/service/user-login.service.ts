import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {
  userLoginOn = false;

  constructor(private router: Router) {
    this.checkUserSession();
  }

  checkUserSession() {
    const usuarioItem = localStorage.getItem('usuario');
    if (usuarioItem) {
      const usuario = JSON.parse(usuarioItem);
      if (usuario) {
        this.setUserLoggedIn();
      } else {
        this.setUserLoggedOut();
      }
    } else {
      this.setUserLoggedOut();
    }
  }

  setUserLoggedIn() {
    this.userLoginOn = true;
  }

  setUserLoggedOut() {
    this.userLoginOn = false;
  }

  logout() {
    localStorage.removeItem('usuario');
    this.userLoginOn = false;
    this.router.navigate(['/inicio']);
  }

  isUserLoggedIn() {
    return this.userLoginOn;
  }
}