import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: any[] = [];

  mostrarFormulario: boolean = false
  productoForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio_producto: ['', Validators.required],
    precio_compra: ['', Validators.required],
    stock: ['', Validators.required],
    imagen: ['', Validators.required],
    categoria: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    
  }

  ngOnInit() {
    this.obtenerProductos();
    this.productoForm = this.formBuilder.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio_producto: ['', Validators.required],
      precio_compra: ['', Validators.required],
      stock: ['', Validators.required],
      imagen: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  obtenerProductos() {
    this.http.get<any[]>('http://localhost:3000/tienda').subscribe(
      data => {
        console.log(data);
        this.productos = data;
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  agregarProducto() {
    if (this.productoForm?.invalid) {
      return;
    }

    const newProduct = this.productoForm?.value;

    this.http.post('http://localhost:3000/inventario', newProduct)
      .subscribe(
        response => {
          // Manejar la respuesta del servidor
          console.log('Producto agregado exitosamente', response);
        },
        error => {
          // Manejar el error en caso de falla en la solicitud
          console.error('Error al agregar el producto', error);
        }
      );
  }
  eliminarProducto(productId: number) {
    const url = 'http://localhost:3000/inventario/' + productId;
  
    this.http.delete(url).subscribe(
      () => {
        console.log('Producto eliminado exitosamente');
        // Realizar acciones adicionales, como actualizar la lista de productos
        window.location.reload();
      },
      error => {
        console.error('Error al eliminar el producto:', error);
      }
    );
  }
  toggleMostrarFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  
}
