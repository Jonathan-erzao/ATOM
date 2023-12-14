import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
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


  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.usuarioForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
      id_provincia: ['', Validators.required],
      id_canton: ['', Validators.required],
      calle: ['', Validators.required]
    });
  }

  agregarUsuario() {
    const usuario = this.usuarioForm.value;
    usuario.rol = 2; // Establecer el rol a 2 por defecto

    const url = 'http://localhost:3000/crearUsuario';

    this.http.post(url, usuario).subscribe(
      (response) => {
        console.log('Usuario creado correctamente:', response);
        // Realizar acciones adicionales si es necesario después de la creación// Actualizar la lista de usuarios
        this.usuarioForm.reset(); // Limpiar el formulario
      },
      (error) => {
        console.error('Error al crear el usuario:', error);
      }
    );
  }
}
