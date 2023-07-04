import { Component, OnInit } from '@angular/core';
import { UserLoginService } from 'src/app/service/user-login.service';
import { RandomUserService } from 'src/app/service/random-user.service';

interface Usuario {
  nombreUsuario: string;
  correoElectronico: string;
}

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css']
})
export class ContactanosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    public servicio: UserLoginService,
    private randomUserService: RandomUserService
  ) { }

  ngOnInit(): void {
    this.generarUsuarios(5);
  }

  generarUsuarios(count: number): void {
    this.randomUserService.getRandomUsers(count).subscribe((response: any) => {
      const results: any[] = response.results;
      this.usuarios = results.map(usuario => ({
        nombreUsuario: `${usuario.name.first} ${usuario.name.last}`,
        correoElectronico: usuario.email
      }));
    });
  }
}
