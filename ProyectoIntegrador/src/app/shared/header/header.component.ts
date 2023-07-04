import { Component } from '@angular/core';
import { UserLoginService } from 'src/app/service/user-login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public servicio: UserLoginService) { }

  toggleLogin() {
    this.servicio.setUserLoggedIn();
  }
  
  logout() {
    this.servicio.setUserLoggedOut();
  }
}
