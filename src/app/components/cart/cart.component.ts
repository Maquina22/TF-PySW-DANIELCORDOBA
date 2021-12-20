import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/productos';
import { Venta } from 'src/app/models/venta';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  ventas!: Venta;
  carritoSubscriber!: Subscription; //variable q permite tener solo una subcripcion al obserbable de carrito
  total!: number;
  cantidad!: number;
  
  constructor(
    private cartService:CartService,
    private firestoreService:FirestoreService,
    private firebaseauthService: FirebaseauthService
    ) { 
      this.initCarrito();
      this.loadVentas();
    }

  ngOnInit(): void {}
  ngOnDestroy(): void{
    // interfaz que se ejecuta para destruir el componente
    if (this.carritoSubscriber) {
      this.carritoSubscriber.unsubscribe(); //aqui desuscribirnos al carrito
    }
  }

  loadVentas() {
    this.carritoSubscriber = this.cartService
      .getCarrito().subscribe((res) => {        
        this.ventas = res;
        this.getTotal();
        this.getCantidad();
      });
  }

  initCarrito() {
    this.ventas = {
      id: '',
      cliente: undefined,
      productos: [], //sera un arreglo de alumnos
      ventaTotal: 0,
      estado: 'enviado',
      fecha: new Date(),
      valoracion: 0,
    };
  }

  addCarrito(producto: Producto) {    
    this.cartService.addProducto(producto);
  }

  removeCarrito(producto: Producto) {
    this.cartService.removeProducto(producto);
  }

  getTotal() {
    this.total = 0;

     this.ventas.productos.forEach(pro =>{
      this.total = this.total + pro.producto.precio;
    });
  }
  getCantidad() {
    this.cantidad = 0;
    this.ventas.productos.forEach(proc =>{
      this.cantidad = this.cantidad + proc.cantidad;
    })
    //this.cantidad = this.ventas.productos.length;
  }
  async enviarLista(){
    if (!this.ventas.productos.length) {      
      return;
    }
    this.ventas.fecha=new Date(); //fecha actual
    this.ventas.ventaTotal=this.total;
    this.ventas.id=this.firestoreService.getId(); //obtenemos un id para poder crear el doc
    const uid = await this.firebaseauthService.getUid(); //obtenemos el uid del usuario autenticado        
    const path= 'Clientes/' + uid + '/ventas/'; //establecemos como se llamara la coleccion y enque parte estara
    this.firestoreService.createDoc(this.ventas,path,this.ventas.id)// creamos el documento
    .then(()=>{      
      Swal.fire({
        title: 'Exito!',
        text: 'Lista de productos enviada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });     
      this.cartService.clearCarrito(); // limpiamos el carrito de la base de datos.
    });
  }
}





