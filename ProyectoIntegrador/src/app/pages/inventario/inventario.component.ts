import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = []; // Esto es solo un ejemplo; necesitarás cargar las categorías desde tu base de datos
  editar: boolean = false;
  mostrarFormulario = false

  productoForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    precioproducto: ['', Validators.required],
    preciocompra: ['', Validators.required],
    stock: ['', Validators.required],
    imagen: ['', Validators.required],
    categoria: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    
  }

  ngOnInit() {
    this.obtenerProductos();
    this.obtenerCategoria();
    this.productoForm = this.formBuilder.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precioproducto: ['', Validators.required],
      preciocompra: ['', Validators.required],
      stock: ['', Validators.required],
      imagen: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  obtenerProductos() {
    this.http.get<any[]>('http://localhost:3000/tienda').subscribe(
      data => {
        console.log('Datos originales:', data); // Imprimir los datos originales
        this.productos = data.map(producto => ({
          ...producto,
        }));
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  obtenerCategoria(){
    this.http.get<any[]>('http://localhost:3000/categorias').subscribe(
      data => {
        console.log('Datos originales:', data); // Imprimir los datos originales
        this.categorias = data.map(categoria => ({
          ...categoria,
        }));// Imprimir después de la conversión
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
  
    // Obtener los datos del formulario
    const newProduct = this.productoForm?.value;
  
    // Enviar los datos al servidor
    this.http.post('http://localhost:3000/crearProducto', newProduct)
      .subscribe(
        response => {
          // Manejar la respuesta del servidor
          console.log('Producto agregado exitosamente', response);
          window.location.reload();
        },
        error => {
          // Manejar el error en caso de falla en la solicitud
          console.error('Error al agregar el producto', error);
        }
      );
  }
  

  // Función para convertir ArrayBuffer a base64
  arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  validarId(id: any): number | null {
    console.log('Valor de ID recibido:', id); // Ver el valor que se recibe
  
    const parsedId = Number(id);
  
    console.log('ID después del parse:', parsedId); // Ver el valor después de la conversión
  
    if (isNaN(parsedId) || parsedId <= 0) {
      console.error('ID no válido');
      return null;
    }
  
    return parsedId;
  }

  confirmarEliminacion(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarProducto(id);
      }
    })
  }
  eliminarProducto(productId: number | null) {
    if (productId === null) {
      console.error('ID no válido');
      return;
    }
    console.log('ID recibido:', productId);
    const id = Number(productId);
  
    if (!isNaN(id) && id > 0) { // Verificar si es un número válido y mayor que 0
      const url = 'http://localhost:3000/inventario/' + id;
  
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
    } else {
      console.error('El ID debe ser un número válido');
    }
  }
   
  cargarProducto(producto: any ){
    this.productoForm.patchValue({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precioproducto: producto.precioproducto,
      preciocompra: producto.preciocompra,
      stock: producto.stock,
      imagen: producto.imagen,
      categoria: producto.categoria
    });
    this.editar = true
    this.mostrarFormulario = true

  }
  
  actualizarProducto(producto:any){
    const url = `http://localhost:3000/acproductos/${producto.id}`; // URL para actualizar el producto con su ID
    this.http.put(url, producto).subscribe(
      (response) => {
        console.log('Producto actualizado correctamente:', response);
        // Realizar acciones adicionales si es necesario después de la actualización
        window.location.reload();
      },
      (error) => {
        console.error('Error al actualizar el producto:', error);
      }
    );
  }

  nombreBusqueda = '';

  buscarProducto() {
    if (this.nombreBusqueda) {
      this.productos = this.productos.filter(producto => producto.nombre.includes(this.nombreBusqueda));
    } else {
      this.obtenerProductos(); // Obtener todos los producto si el campo de búsqueda está vacío
    }
  }


  toggleMostrarFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }


  
}
