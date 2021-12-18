import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn:boolean = false;
  loggedInUser:any;
  public totalItem:number=0;

  constructor(private loginService:LoginService, private router:Router, private cartService:CartService) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe((auth)=>{
      if (auth) {
        this.isLoggedIn=true;
        this.loggedInUser = auth.email;    
        this.cartService.getProducts().subscribe(res=>{
          this.totalItem = res.length;
        })
                   
      } else {
        this.isLoggedIn=false;  
        this.cartService.getProducts().subscribe(res=>{
          this.totalItem = res.length;
        })      
      }
    });
  }

  //Metodo para cerrar sesion
  logout(){
    this.loginService.logout();
    this.isLoggedIn= false;
    this.router.navigate(['']);
    Swal.fire({
      title:"Exito!", text:"Muchas gracias!", icon: 'success', confirmButtonText:"Aceptar"
    });
  }

}
