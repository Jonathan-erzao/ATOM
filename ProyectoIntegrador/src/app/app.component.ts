import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.checkUserSession();
  }

  checkUserSession() {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      const usuario = JSON.parse(usuarioJSON);
      if (usuario.rnombre === 'admin') {
        this.router.navigate(['/admin']);
      } else if (usuario.rnombre === 'user') {
        this.router.navigate(['/inicio']);
      } else {
        console.error('Rol desconocido');
      }
    } else {
      // Si no hay una sesión de usuario activa, redirigir al usuario a la página de inicio
      this.router.navigate(['/']);
    }
  }
}