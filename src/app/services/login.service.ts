import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService:AngularFireAuth) { }

  //Metodo para iniciar sesion
  login(email:string, password:string){
    return new Promise((resolve,rejects)=>{
      this.authService.signInWithEmailAndPassword(email,password).then(
        (datos)=>resolve(datos),
        (error)=>rejects(error)
      );
    });
  }

  //Metodo para recuperar el usuario autenticado
  getAuth(){
    return this.authService.authState.pipe(map((auth)=>auth));
  }

  //Metodo para salir
  logout(){
    this.authService.signOut();
  }

  //Metodo para registrarse
  registrarse(email:string, password:string){
    return new Promise((resolve, rejects)=>{
      this.authService.createUserWithEmailAndPassword(email,password).then(
        (datos)=>resolve(datos),
        (error)=>rejects(error)
      );
    });
  }
}
