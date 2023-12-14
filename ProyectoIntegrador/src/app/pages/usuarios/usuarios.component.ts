import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  usuarios: any[] = [];
  mostrarFormulario = false
  roles: any[] = [];
  editar: boolean = false;
  usuarioForm: FormGroup = this.formBuilder.group({
    id: ['', Validators.required],
    nombre: ['', Validators.required],
    correo: ['', Validators.required],
    contraseña: ['', Validators.required],
    id_provincia: ['', Validators.required],
    id_canton: ['', Validators.required],
    calle: ['', Validators.required],
    rol: ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {

  }
  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerRoles();
    this.usuarioForm = this.formBuilder.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      contraseña: ['', Validators.required],
      id_provincia: ['', Validators.required],
      id_canton: ['', Validators.required],
      calle: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  obtenerRoles() {
    this.http.get<any[]>('http://localhost:3000/roles').subscribe(
      data => {
        console.log('Datos originales:', data); // Imprimir los datos originales
        this.roles = data.map(rol => ({
          ...rol,
        }));// Imprimir después de la conversión
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
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

  agregarUsuario() {
    const usuario = this.usuarioForm.value;
    const url = 'http://localhost:3000/crearUsuario';

    this.http.post(url, usuario).subscribe(
      (response) => {
        console.log('Usuario creado correctamente:', response);
        // Realizar acciones adicionales si es necesario después de la creación
        this.obtenerUsuarios(); // Actualizar la lista de usuarios
        this.usuarioForm.reset(); // Limpiar el formulario
      },
      (error) => {
        console.error('Error al crear el usuario:', error);
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
        this.eliminarUsuario(id);
      }
    })
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

  cargarUsuario(usuario: any) {
    this.usuarioForm.patchValue({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      contraseña: usuario.contraseña,
      id_provincia: usuario.id_provincia,
      id_canton: usuario.id_canton,
      calle: usuario.calle,
      rol: usuario.rnombre
    });
    this.editar = true
    this.mostrarFormulario = true

  }

  actualizarUsuario() {
    const usuario = this.usuarioForm.value;
    const url = `http://localhost:3000/acUsuario/${usuario.id}`; // URL para actualizar el usuario con su ID
    this.http.put(url, usuario).subscribe(
      (response) => {
        console.log('Usuario actualizado correctamente:', response);
        // Realizar acciones adicionales si es necesario después de la actualización
        window.location.reload();
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }

  nombreBusqueda = '';

  buscarUsuario() {
    if (this.nombreBusqueda) {
      this.usuarios = this.usuarios.filter(usuario => usuario.nombre.includes(this.nombreBusqueda));
    } else {
      this.obtenerUsuarios(); // Obtener todos los usuarios si el campo de búsqueda está vacío
    }
  }
  ocultarContrasena(contrasena: string) {
    return '•'.repeat(contrasena.length);
  }
  mostrarContrasenaForm = false;

  cambiarMostrarContrasenaForm() {
    this.mostrarContrasenaForm = !this.mostrarContrasenaForm;
  }
  toggleMostrarFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
  mostrarContrasena = false;

  cambiarMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}
