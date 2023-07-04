import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-provedores',
  templateUrl: './provedores.component.html',
  styleUrls: ['./provedores.component.css']
})
export class ProvedoresComponent {
  proveedores: any[] = [];
  constructor( private http: HttpClient) {
  
  }
  ngOnInit() {
    this.obtenerProveedores();
  }
  obtenerProveedores() {
    this.http.get<any[]>('http://localhost:3000/provedores').subscribe(
      data => {
        console.log(data);
        this.proveedores = data;
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  eliminarProveedor(provedorId: number) {
    const url = 'http://localhost:3000/provedores/' + provedorId;
  
    this.http.delete(url).subscribe(
      () => {
        console.log('Proveedor eliminado exitosamente');
        // Realizar acciones adicionales, como actualizar la lista de proveedores
        window.location.reload();
      },
      error => {
        console.error('Error al eliminar el proveedor:', error);
      }
    );
  }
  
}
