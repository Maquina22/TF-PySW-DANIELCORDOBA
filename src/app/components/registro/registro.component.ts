import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Cliente } from 'src/app/models/cliente';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {

  public suscriberUserInfo!: Subscription;

  cliente: Cliente = {
    uid: '',
    email: '',
    password: '',
  };

  formTemplate = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),    
  });

  get formControls() {
    return this.formTemplate['controls'];
  }

  uid = '';
  constructor(
    private firebaseauthService: FirebaseauthService,
    private firestoreService: FirestoreService,
    private firestorageService: FirestorageService) {
    this.firebaseauthService.stateAuth().authState.subscribe((res) => {
      if (res !== null) {
        this.uid = res.uid;        
        this.getUserInfo(this.uid);
      } else {
        this.initCliente();
      }
    });
  }
  //
  initCliente() {
    this.uid = '';
    this.cliente = {
      uid: '',
      email: '',
      password: '',      
    };
  }

  // ngOnInit(): void {
  // }
  async ngOnInit() {
    const uid = await this.firebaseauthService.getUid();    
  }
  
  async registrarse() {
    const credencial = {
      email: this.cliente.email,
      password: this.cliente.password,
    };
    const res = await this.firebaseauthService
      .registrar(credencial.email, credencial.password)
      .catch((error) => {        
        this.mostrarError('error ' + error);
        return;
      });    

    const uid = await this.firebaseauthService.getUid();
    
    if (uid != null) {
      this.cliente.uid = uid;

      this.guardarUser();
    } else {
      console.log('error al Obtener ID ');
    }
  }

  async guardarUser() {
    const path = 'Clientes';
    const email = this.cliente.email;

    this.firestoreService
      .createDoc(this.cliente, path, this.cliente.uid)
      .then((res) => {
        
        Swal.fire({
          title: 'Exito!',
          text: 'Guardado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      })
      .catch((error) => {
        this.mostrarError('error al guardar ' + error);
      });
  }

  salir() {
    this.firebaseauthService.logout();
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

  getUserInfo(uid: string) {
    const path = 'Clientes';
    //GlobalComponent.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe((res) => {
      this.suscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe((res) => {
      if (res != undefined) {
        this.cliente = res as Cliente;        
      }
      
    });
  }
}
