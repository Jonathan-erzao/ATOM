import { Component, OnInit } from '@angular/core';
import { UserLoginService } from 'src/app/service/user-login.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit{
  productos: any[] = [];
  carrito: any[] = [];
  totalPrice: number = 0;
  showCart = false;
  toggleCart() {
    this.showCart = !this.showCart;
  }
  constructor(public servicio: UserLoginService,public http: HttpClient,) { }
  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/tienda').subscribe(
      data => {
        // Aquí tienes acceso a los datos recibidos del servidor
        console.log(data);
  
        // Almacena los datos en una variable de componente si deseas utilizarlos en el HTML
        this.productos = data;
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
  }
  addToCart(product: any) {
    this.carrito.push(product);
    this.calculateTotalPrice();
  }
  buy() {
    // Obtén el correo electrónico del usuario utilizando un prompt
    const email = prompt('Ingresa tu correo electrónico');

    if (email) {
      // Crea un objeto factura con los datos del carrito
      const factura = {
        email: email,
        productos: this.carrito,
        total: this.totalPrice
      };
    }
  }

  // Función para eliminar un producto del carrito
  removeFromCart(product: any) {
    const index = this.carrito.indexOf(product);
    if (index !== -1) {
      this.carrito.splice(index, 1);
      this.calculateTotalPrice();
    }
  }

  // Función para calcular el precio total del carrito
  calculateTotalPrice() {
    this.totalPrice = this.carrito.reduce((total, product) => {
      return total + parseFloat(product.precio_compra);
    }, 0);
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }
}
