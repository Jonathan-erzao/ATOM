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
  correo = '';
  contrasena = '';

  constructor(private http: HttpClient, private router: Router, public userLoginService: UserLoginService) {}

  login() {
    console.log('Método login llamado');
    this.http.get<any[]>('http://localhost:3000/usuarios').subscribe(
      usuarios => {
        const usuario = usuarios.find(u => u.correo === this.correo && u.contraseña === this.contrasena);
        if (usuario) {
          console.log('Usuario encontrado:', usuario);
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.userLoginService.setUserLoggedIn(); // Actualiza el estado de inicio de sesión
          if (usuario.rnombre === 'admin') {
            console.log('Redirigiendo a /admin');
            this.router.navigate(['/admin']);
          } else if (usuario.rnombre === 'user') {
            console.log('Redirigiendo a /inicio');
            this.router.navigate(['/inicio']);
          } else {
            console.error('Rol desconocido');
          }
        } else {
          console.error('Credenciales inválidas');
        }
      },
      error => {
        console.error('Error al obtener los usuarios:', error);
      }
    );
  }
}