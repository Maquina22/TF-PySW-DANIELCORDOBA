import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  email!:string;
  password!:string;

  constructor(private router:Router, private loginService:LoginService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe((auth)=>{
      if (auth) {
        this.router.navigate(['/registrar']);        
      } else {
        this.mostrarError('Tiene que estar autenticado...');
      }
    })
  }

   //Metodo para mostrar errores
   mostrarError(textito: string) {
    Swal.fire({
      title: 'Error!',
      text: textito + ' Intentalo nuevamente',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
  }

  //Metodo para registrar
  registro(){
    this.loginService.registrarse(this.email, this.password).then((res)=>{
      this.router.navigate(['']);
    }).catch((error)=>{
      this.mostrarError('Error al registrar...')
    })
  }

}
