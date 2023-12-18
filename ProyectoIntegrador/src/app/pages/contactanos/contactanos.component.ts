import { Component, OnInit } from '@angular/core';
import { UserLoginService } from 'src/app/service/user-login.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Usuario {
  nombreUsuario: string;
  correoElectronico: string;
}

interface Comentario {
  id: number;
  id_usuario: number;
  nombre: string; // Agrega esta línea
  comentario: string;
  fecha: Date;
}

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css']
})
export class ContactanosComponent implements OnInit {
  readonly urlImg = 'assets/img/';
  rutasImagenes = [this.urlImg + 'zoro.jpg', this.urlImg + 'luffy.jpg', this.urlImg + 'ace.jpg', this.urlImg + 'chopper.jpg', this.urlImg + 'franky.jpg'];
  usuarios: Usuario[] = [];
  comentarios: Comentario[] = [];
  nuevoComentario = '';
  constructor(
    public servicio: UserLoginService,
    private router: Router,
    private http: HttpClient
  ) { }
  usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');
  ngOnInit(): void {
    this.getComentarios();
  }

  getComentarios() {
    this.http.get<Comentario[]>('http://localhost:3000/obtenerComentarios').subscribe((data: Comentario[]) => {
      this.comentarios = data;
    });
  }

  crearComentario() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuario') || '{}');
    const comentario = { id_usuario: usuarioActual.id, comentario: this.nuevoComentario };

    this.http.post('http://localhost:3000/insertarComentario', comentario).subscribe(() => {
      this.getComentarios(); // actualizar la lista de comentarios
      this.nuevoComentario = ''; // limpiar el campo de texto
    });
  }
  obtenerRutaImagenAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * this.rutasImagenes.length);
    return this.rutasImagenes[indiceAleatorio];
  }
  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/inicio']);
  }
}