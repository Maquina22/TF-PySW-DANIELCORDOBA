import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email!: string;
  password!:string;

  constructor(private router:Router, private loginService:LoginService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe((auth)=>{
      if (auth) {
        this.router.navigate(['/'])        
      }
    });
  }

  //Metodo para iniciar sesion
  login(){
    this.loginService.login(this.email, this.password).then((res)=>{
      this.router.navigate(['/'])
    }).catch((error)=>{
      this.mostrarError('Error en login ')
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

}
