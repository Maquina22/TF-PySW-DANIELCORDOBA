import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { Venta } from 'src/app/models/venta';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  ventas!: Venta;
  carritoSubscriber!: Subscription; //variable q permite tener solo una subcripcion al obserbable de carrito
  suscriberUserInfo!:Subscription;
  unLogueado:boolean=false;

  cliente:Cliente = {
    uid: '',
    email: '',
    password: '',
  };

  uid = '';
  cantidadProductos = 0;

  idAdmin:string = 'tYH3ZMMxiaO2zaLBUczcYnLEAPf2';
  esAdmin:boolean = false;

  constructor(
    private firebaseauthService: FirebaseauthService,
    private firestoreService: FirestoreService, 
    private cartService:CartService) {
      this.initCarrito();
      this.loadVentas();
      this.firebaseauthService.stateAuth().authState.subscribe((res)=>{
        if (res != null) {
          this.uid = res.uid;  
          this.getUserInfo(this.uid);
          this.unLogueado=true;   
          
          if (res.uid === this.idAdmin) {
            this.esAdmin = true;            
          }
        } else {
          this.unLogueado=false;
        }
      })
     }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    // interfaz que se ejecuta para destruir el componente    
    if (this.carritoSubscriber) {
      this.carritoSubscriber.unsubscribe(); //aqui desuscribirnos al carrito
    }
  }

  loadVentas() {
    this.carritoSubscriber = this.cartService
      .getCarrito()
      .subscribe((res) => {
        console.log('loadNominado() en carrito ', res);
        this.ventas = res;
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

  //obtiene la cantidad de elementos en el carrito
  getCantidad() { 
    this.cantidadProductos = 0;
    this.cantidadProductos = this.ventas.productos.length;
  }


  salir(){
    this.firebaseauthService.logout()


    Swal.fire({
      title: 'Saliendo',
      text: 'Estas seguro de querer salir?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Salir',
    }).then((result) => {
      if (result.isConfirmed) {
        this.firebaseauthService.logout().then(
          (respuesta) => {
            Swal.fire('Saliendo!', 'Cerrando sesión.', 'success');

          },
          (error) => {
            this.mostrarError('Error al eliminar producto');
          }
        );
          //GlobalComponent.suscriberUserInfo.unsubscribe();

      } else if (!result.isConfirmed || result.dismiss) {
        
      }
    });
  }
  getUserInfo(uid: string) {
    const path = 'Clientes';
    //GlobalComponent.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe((res) => {
      this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe((res) => {
      if (res != undefined) {
        this.cliente = res as Cliente;        
      }
    });
  }

    //metodo para mostrar errores
    mostrarError(textito: string) {
      Swal.fire({
        title: 'Error!',
        text: textito + ' Intentalo nuevamente',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }

}
