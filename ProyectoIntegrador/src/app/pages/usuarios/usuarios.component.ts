import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  usuarios: any[] = [];
  constructor(private http: HttpClient) {
    
  }
  ngOnInit() {
    this.obtenerUsuarios();
  }
  obtenerUsuarios() {
    
    this.http.get<any[]>('http://localhost:3000/usuarios').subscribe(
      data => {
        console.log(data);
        this.usuarios = data;
      },
      error => {
        console.error('Error al obtener los datos de usuarios:', error);
      }
    );
  }

  eliminarUsuario(userId: number) {
    const url = 'http://localhost:3000/usuarios/' + userId;
  
    this.http.delete(url).subscribe(
      () => {
        console.log('Usuario eliminado exitosamente');
        // Realizar acciones adicionales, como actualizar la tabla de usuarios
        window.location.reload();
      },
      error => {
        console.error('Error al eliminar el usuario:', error);
      }
    );
  }
  
  
}
