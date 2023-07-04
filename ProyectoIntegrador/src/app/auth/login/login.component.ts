import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/service/user-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  userLoginOn: boolean = false;

  constructor(private http: HttpClient, private router: Router, public userLoginService: UserLoginService) {}

  login() {
    // Realizar la petición GET para obtener todos los usuarios
    if (this.correo === 'admin@admin.com' && this.contrasena === 'superadmin') {
      // Inicio de sesión exitoso con datos quemados
      this.userLoginService.setUserLoggedIn();
      this.router.navigate(['/admin']);
    }else {this.http.get<any[]>('http://localhost:3000/usuarios').subscribe(
      usuarios => {
        // Verificar si las credenciales coinciden con algún usuario
        const usuario = usuarios.find(u => u.correo === this.correo && u.contraseña === this.contrasena);
        if (usuario) {
          // Inicio de sesión exitoso
          if (usuario.correo === 'admin@damin.com' && usuario.contraseña === 'superadmin') {
            this.router.navigate(['/admin']);
          } else {
            this.userLoginService.setUserLoggedIn();
            this.router.navigate(['/inicio']);
          }
        } else {
          // Credenciales inválidas
          console.error('Credenciales inválidas');
        }
      },
      error => {
        console.error('Error al obtener los usuarios:', error);
      })}
    ;
  }
}
