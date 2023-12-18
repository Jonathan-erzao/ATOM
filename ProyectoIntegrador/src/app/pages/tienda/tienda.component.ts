import { Component, OnInit } from '@angular/core';
import { UserLoginService } from 'src/app/service/user-login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

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
    // Verifica si el carrito está vacío
    if (this.carrito.length === 0) {
      alert('No has agregado ningún producto al carrito.');
      return;
    }
  
    // Solicita el número de teléfono al usuario
    let telefono = prompt('Por favor, introduce tu número de teléfono:');
    
    // Si el usuario presiona cancelar, asigna un valor predeterminado a telefono
    if (telefono === null) {
      telefono = 'No proporcionado';
    }
  
    // Pasa el número de teléfono al método generateInvoice
    this.generateInvoice(telefono);
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

  getBase64Image(imgUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imgUrl;
      img.onload = () => {
        let canvas = document.createElement('CANVAS') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d')!;
        let dataURL: string;
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL('image/png'); // Cambia 'image/jpeg' a 'image/png'
        resolve(dataURL);
      };
    });
  }

  async generateInvoice(telefono: string) {
    const doc = new jsPDF();
    const imgData = await this.getBase64Image('assets/img/FooterAtom.png');
    doc.addImage(imgData, 'PNG', 15, 10, 80, 40); // Aumenta el tamaño de la imagen

    // Encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10); // Reduce el tamaño de la fuente
    doc.setTextColor(40);
    doc.text('Factura ATOM', 180, 20, { align: 'right' }); // Cambia 'Factura de ATOM' a 'ATOM'

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8); // Reduce el tamaño de la fuente para el texto del instituto
    doc.text('Instituto Superior Tecnológico Yavirac', 180, 25, { align: 'right' });
    doc.text('García Moreno S4-35 y, Quito 170401', 180, 30, { align: 'right' });

    // Línea gris
    doc.setDrawColor(169, 169, 169); // Color gris
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40); // Mueve la línea gris un poco hacia abajo

    // Fecha de la factura
    const fecha = new Date().toLocaleDateString('es-ES');
    doc.setFont('helvetica', 'normal'); // Cambia el tipo de letra a 'helvetica'
    doc.setFontSize(12); // Cambia el tamaño de la letra a 14
    doc.text(`Fecha: ${fecha}`, 20, 50); // Mueve la fecha un poco hacia abajo
    const numeroFactura = Math.floor(Math.random() * 9000) + 1000;
    doc.text(`NroFactura: #${numeroFactura}`, 130, 50);

    // Datos del usuario
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario || !usuario.nombre) {
      console.error('No se encontró el nombre del usuario en localStorage');
      return;
    }
    doc.setFont('helvetica', 'normal'); // Cambia el tipo de letra a 'helvetica'
    doc.setFontSize(12); // Cambia el tamaño de la letra a 14
    doc.text(`Nombre: ${usuario.nombre}`, 20, 60); // Mueve los datos del usuario un poco hacia abajo
    doc.text(`Correo: ${usuario.correo}`, 130, 60);
    doc.text(`Direccion del usuario: ${usuario.id_provincia}, ${usuario.id_canton}, ${usuario.calle} `, 20, 70);
    doc.text(`Telefono: ${telefono}`, 20, 80);

    // Línea divisoria
    doc.setDrawColor(32, 35, 44);
    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90); // Mueve la línea divisoria un poco hacia abajo

    // Elementos del carrito
    doc.setFont('helvetica', 'bold');
    doc.text('Producto', 20, 95); // Mueve los elementos del carrito hacia arriba
    doc.text('Cantidad', 140, 95, { align: 'right' });
    doc.text('Precio', 160, 95, { align: 'right' });
    doc.text('Total', 180, 95, { align: 'right' });
    doc.setFont('times', 'normal');
    let offset = 105;
    this.carrito.forEach((item, index) => {
      const totalProducto = item.product.preciocompra * item.quantity; // Define la variable 'item' antes de usarla
      doc.text(item.product.nombre, 20, offset + index * 10);
      doc.text(`${item.quantity}`, 140, offset + index * 10, { align: 'right' });
      doc.text(`${item.product.preciocompra}`, 160, offset + index * 10, { align: 'right' });
      doc.text(`${totalProducto}`, 180, offset + index * 10, { align: 'right' });
    });
    //Linea divisora
    doc.setDrawColor(32, 35, 44); // Color azul
    doc.setLineWidth(0.5);
    doc.line(20, offset + this.carrito.length * 10 + 10, 190, offset + this.carrito.length * 10 + 10);

    // Total
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${this.totalPrice}`, 180, offset + this.carrito.length * 10 + 20, { align: 'right' });

    // Pie de página
    doc.setFont('courier', 'italic');
    doc.setFontSize(8);
    doc.text('Gracias por comprar en ATOM', 105, 280, { align: 'center' });

    doc.save(`Factura${numeroFactura}.pdf`);
    this.carrito = [];
    this.totalPrice = 0;
  }




}
