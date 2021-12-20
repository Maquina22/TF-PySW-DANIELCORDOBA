import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Cliente } from '../models/cliente';
import { ProductoVenta, Venta } from '../models/venta';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';
import { Producto} from '../models/productos'

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private ventas!:Venta;
  ventas$ = new Subject<Venta>();
  
  path = 'carrito/';
  uid = '';
  cliente!:Cliente; 

  constructor(
    private firebaseauthService:FirebaseauthService,
    private firestoreService:FirestoreService,
    private router:Router
    ) {
      this.initCarrito();

      this.firebaseauthService.stateAuth().authState.subscribe((res) => {
      //verificamos que este logueado
      if (res !== null) {
        this.uid = res.uid; // cargamos el carrito de ese usuario
        this.loadCliente();
      }
    });
    }
    

    loadCarrito() {
      const path = 'Clientes/' + this.uid + '/' + 'carrito';
      this.firestoreService.getDoc<Venta>(path, this.uid).subscribe((res) => {
        
        if (res) { // para que no nos tire el error de undefined con un elemento en la vista
          res = this.ventas;
          this.ventas$.next(this.ventas); //aqui esta emitiendo el observable
        } else {
          this.initCarrito();
        }
      });
    }
  
    initCarrito() {
      this.ventas = {
        id: this.uid,
        cliente: this.cliente,
        productos:[], //sera un arreglo de alumnos
        ventaTotal: 0,
        estado: 'enviado',
        fecha: new Date(),
        valoracion: 0,
      };
      this.ventas$.next(this.ventas); //aqui esta emitiendo el observable
    }
  
    loadCliente() {
      const path = 'Clientes';
      this.firestoreService.getDoc<Cliente>(path, this.uid).subscribe((res) => {
        if (res != undefined) {
          this.cliente = res as Cliente;
          this.loadCarrito();          
        }
      });
    }
  
    getCarrito(): Observable<Venta> {
      setTimeout(()=>{
        this.ventas$.next(this.ventas);//damos 100ms
      },100);
          return this.ventas$.asObservable();
     
    }
  
    addProducto(producto: Producto) {
      if (this.uid.length) {
        const item = this.ventas.productos.find((productoVenta) => {
          //busca si el Alumno ya esta en la lista de carrito
          return productoVenta.producto.id === producto.id;
        });
        if (item !== undefined) {
          //si existe ese alumno solo se incrementa la nominacion
          item.cantidad++;
        } else {
          const add: ProductoVenta = {
            cantidad: 1,
            producto: producto,
          };
          this.ventas.productos.push(add); //luego agregamos al carro
        }
      } else {
        this.router.navigate(['/login']);
        return;
      }
      this.ventas$.next(this.ventas);//llamamos nuemavente al obserbable para q se refleje en la vista
      
      const path = 'Clientes/' + this.uid + '/' + this.path;
      this.firestoreService
        .createDoc(this.ventas, path, this.ventas.id) //guardamos en la db, path es variable local y se usa el mismo id q el del usuario
        .then(() => {
         
        });
    }
  
    removeProducto(producto: Producto) {      
      if (this.uid.length) {
        let position = 0;
        const item = this.ventas.productos.find((productoVenta, index) => {
          //busca si el Alumno ya esta en la lista de carrito y su indice
          position = index; //guardamos el index del elemento a eliminar
          return productoVenta.producto.id === producto.id;
        });
        if (item !== undefined) {
          //si existe ese alumno solo se incrementa la nominacion
          item.cantidad--;
          if (item?.cantidad === 0) {
            this.ventas.productos.splice(position, 1); //esplice elimina desde donde y cuantos elementos
          }         
          const path = 'Clientes/' + this.uid + '/' + this.path;
          this.firestoreService
            .createDoc(this.ventas, path, this.ventas.id) //guardamos en la db, path es variable local y se usa el mismo id q el del usuario
            .then(() => {
             
            });
        }
      }
    }
       
    //funcion para eliminar los elementos del carrito en la base de datos
    clearCarrito(){
  
      const path = 'Clientes/' + this.uid + '/' + 'carrito';
      this.firestoreService.deleteDoc(path, this.uid)
      .then(()=>{
        this.initCarrito(); // limpia el carrito en la vista        
      });
  
    }
  
}
