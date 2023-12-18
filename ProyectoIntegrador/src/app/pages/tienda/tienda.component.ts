import { Component, OnInit } from '@angular/core';
import { UserLoginService } from 'src/app/service/user-login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  productos: any[] = [];
  carrito: any[] = [];
  totalPrice = 0;
  showCart = false;
  toggleCart() {
    this.showCart = !this.showCart;
  }
  constructor(public servicio: UserLoginService, public http: HttpClient, private router: Router) { }
  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/tienda').subscribe(
      data => {
        // Aquí tienes acceso a los datos recibidos del servidor
        console.log(data);

        // Imprime el precio_compra de cada producto
        data.forEach(producto => {
          console.log(producto.preciocompra);
        });

        // Almacena los datos en una variable de componente si deseas utilizarlos en el HTML
        this.productos = data;
      },
      error => {
        console.error('Error al obtener los datos:', error);
      }
    );
    this.productos.forEach(producto => {
      if (!producto.hasOwnProperty('precio_compra')) {
        console.error('El producto no tiene una propiedad precio_compra:', producto);
      }
    });
  }

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/inicio']);
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
  addToCart(product: any) {
    // Busca el producto en el carrito
    const foundProduct = this.carrito.find(item => item.product.id === product.id);
  
    if (foundProduct) {
      // Si el producto ya está en el carrito, aumenta la cantidad
      foundProduct.quantity += 1;
    } else {
      // Si el producto no está en el carrito, agrega un nuevo objeto con el producto y una cantidad de 1
      this.carrito.push({ product: product, quantity: 1 });
    }
  
    this.calculateTotalPrice();
  }
  
  // Modifica la función calculateTotalPrice para multiplicar el precio del producto por la cantidad
  calculateTotalPrice() {
    this.totalPrice = this.carrito.reduce((total, item) => {
      return total + (parseFloat(item.product.preciocompra) * item.quantity);
    }, 0);
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }
  
  // Modifica la función removeFromCart para disminuir la cantidad o eliminar el producto si la cantidad es 0
  removeFromCart(item: any) {
    item.quantity -= 1;
    if (item.quantity === 0) {
      const index = this.carrito.indexOf(item);
      if (index !== -1) {
        this.carrito.splice(index, 1);
      }
    }
    this.calculateTotalPrice();
  }

  
}
