import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/productos';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {

  Productos:Producto[]=[];
  filtroPost=''; //se usa para filtrar
  private path ='Productos/'; //Esto hace referencia al path de la collection

  constructor(private firestoreService:FirestoreService, private firestorageService:FirestorageService, private cartService:CartService) { }

  formTemplate = new FormGroup({
    bodega: new FormControl('',Validators.required),
    marca: new FormControl('',Validators.required),
    variedad: new FormControl('',Validators.required),
    varietal: new FormControl('',Validators.required),
    precio: new FormControl('',Validators.required),
    imageUrl: new FormControl('',Validators.required),
  });

  get formControls(){
    return this.formTemplate['controls'];
  }

  newProducto:Producto={
    bodega: this.formTemplate.get('bodega')?.value,
    marca: this.formTemplate.get('marca')?.value,
    variedad: this.formTemplate.get('variedad')?.value,
    varietal: this.formTemplate.get('varietal')?.value,
    precio: this.formTemplate.get('precio')?.value,
    foto:'',
    id:'',
    fechaRegistro: new Date()
  }


  ngOnInit(): void {
    this.getProductos();
  }

  addToCart(item:any){
    this
    this.cartService.addtoCart(item);
  }

  //Metodo para obtener toda la coleccion
  getProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe((res)=>{      
      this.Productos=res;
    })
  }

  public page:number=0;
  //para gestionar la paginacion
  nextPage(){
    this.page+=6;
  }

  prevPage(){
    if (this.page>0) {
      this.page-=6;      
    }
  }

}
