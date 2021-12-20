import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { map } from 'rxjs';
import { CartComponent } from './components/cart/cart.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { ProductoListComponent } from './components/productos/producto-list/producto-list.component';
import { ProductoComponent } from './components/productos/producto/producto.component';
import { ProductosComponent } from './components/productos/productos.component';
import { RegistroComponent } from './components/registro/registro.component';
import { canActivate } from '@angular/fire/compat/auth-guard'

const uiAdmin = 'tYH3ZMMxiaO2zaLBUczcYnLEAPf2';
const onlyAdmin = () => map((user:any) => !! user && user.uid === uiAdmin);

const routes: Routes = [
  {path:'', component:MainComponent},
  {path:'login', component:LoginComponent},
  {path:'productos/list', component:ProductoListComponent},
  {path:'nosotros', component:NosotrosComponent},
  {path:'contacto', component:ContactoComponent},
  {path:'carrito', component:CartComponent},
  {path:'registrar', component:RegistroComponent},
  {path:'productos', component:ProductosComponent,children:[
    {path:'upload', component:ProductoComponent, ...canActivate(onlyAdmin)},  
    {path:'list', component:ProductoListComponent} 
    ]
  },
  {path:'**', component:MainComponent} //se puede agregar pagina Error 404


  /*{path:'',redirectTo:'productos/upload',pathMatch:'full'}, //ruta por defecto
  {path:'productos', component:ProductosComponent,children:[
    {path:'upload', component:ProductoComponent},  //en el navegador productos/upload
    {path:'list', component:ProductoListComponent} //en el navegador productos/list
  ]}*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
