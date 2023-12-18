import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provedores',
  templateUrl: './provedores.component.html',
  styleUrls: ['./provedores.component.css']
})
export class ProvedoresComponent {
  proveedores: any[] = [];
  mostrarFormulario = false
  editar: boolean = false;
  provedorForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    correo: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder, private http: HttpClient,private router: Router) {

  }
  ngOnInit() {
    this.obtenerProveedores();
    this.provedorForm = this.formBuilder.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      correo: ['', Validators.required],
    });
  }
  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/inicio']);
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
        this.eliminarProveedor(id);
      }
    })
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

  agregarProvedor() {
    const provedor = this.provedorForm.value;
    const url = 'http://localhost:3000/agregarProvedores';

    this.http.post(url, provedor).subscribe(
      (response) => {
        console.log('Proveedor creado correctamente:', response);
        // Realizar acciones adicionales si es necesario después de la creación
        this.obtenerProveedores(); // Actualizar la lista de proveedores
        this.provedorForm.reset(); // Limpiar el formulario
      },
      (error) => {
        console.error('Error al crear el proveedor:', error);
      }
    );
  }

  actualizarProvedor() {
    const provedor = this.provedorForm.value;
    const url = `http://localhost:3000/acprovedor/${provedor.id}`; // URL para actualizar el proveedor con su ID
    this.http.put(url, provedor).subscribe(
      (response) => {
        console.log('Proveedor actualizado correctamente:', response);
        // Realizar acciones adicionales si es necesario después de la actualización
        window.location.reload();
      },
      (error) => {
        console.error('Error al actualizar el proveedor:', error);
      }
    );
  }

  cargarProvedor(proveedor: any) {
    this.provedorForm.patchValue({
      id: proveedor.id,
      nombre: proveedor.nombre,
      descripcion: proveedor.descripcion,
      correo: proveedor.correo,
    });
    this.editar = true
    this.mostrarFormulario = true

  }

  toggleMostrarFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
}
