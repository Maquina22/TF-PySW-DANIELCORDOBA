import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/productos';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  Productos:Producto[]=[];
  newImage:string="/assets/images/vino.png";
  newFile:any; //contener el archivo imagen
  filtroPost=''; //se usa para filtrar
  imgSrc='/assets/images/vino.png';
  isSubmitted!:boolean; //se usa para cuando se presione el boton guardar
  seCargoFoto:boolean = false; //variable es para verificar si se cargo la foto
  private path ='Productos/'; //Esto hace referencia al path de la collection

  constructor(private firestoreService:FirestoreService, private firestorageService:FirestorageService) { }

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

  //Metodo para guardar
  async guardarProducto(){
    if (this.newProducto.id) {
      //es editar
      const path = 'Productos';
      const name = this.newProducto.varietal;
      const res = this.firestoreService.getDoc(path, this.newProducto.id);
      if (this.seCargoFoto==true) {
        const res = await this.firestorageService.uploadImage(this.newFile, path, name);    
        this.newProducto.foto=res;         
        this.seCargoFoto=false;
      } else {        
        this.newProducto.foto=this.imgSrc;
      }
      this.firestoreService.updateDoc(this.newProducto, this.path, this.newProducto.id).then((res)=>{
        Swal.fire({
          title:"Exito!", text:"Producto actualizado correctamente!", icon: 'success', confirmButtonText:"Aceptar"
        });
      }).catch((error)=>{
        this.mostrarError('Error al actualizar producto...')
      });
      this.formTemplate.reset();
      this.resetForm();      
    } else {
      //es guardar
      this.isSubmitted=true;      
      if (this.formTemplate.valid) {
        this.newProducto.id=this.firestoreService.getId();
        const path='Producto';
        const name=this.newProducto.varietal;

        const res = await this.firestorageService.uploadImage(this.newFile, path, name); 
        this.newProducto.foto=res;        
        this.firestoreService.createDoc(this.newProducto, this.path, this.newProducto.id).then((res)=>{
          Swal.fire({
            title:"Exito!", text:"Producto guardado correctamente!", icon: 'success', confirmButtonText:"Aceptar"
          });
        }).catch((error)=>{
          this.mostrarError('Error al guardar producto...')
        });
        this.formTemplate.reset();
        this.resetForm();
      }
    }
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
  
  //Metodo para resetear el formulario
  textoBoton:string = 'Guardar en galeria';
  resetForm(){
    this.newProducto.id='';   
    this.formTemplate.setValue({
      bodega:'',
      marca:'',
      variedad:'',
      varietal:'',
      precio:'',
      imageUrl:''
    });  
    this.newFile=null;
    this.isSubmitted=false;    
    this.imgSrc='/assets/images/vino.png';
    this.textoBoton='Guardar en galeria';   
    this.formTemplate.reset(); 
  }

   //Metodo para obtener toda la coleccion
   getProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe((res)=>{      
      this.Productos=res;
    })
  }

   //Metodo para eliminar producto
   deleteProductos(producto: Producto) {    
    Swal.fire({
      title: 'Eliminar',
      text: 'Vas a eliminar un registro!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.firestoreService.deleteDoc(this.path, producto.id).then(
          (respuesta) => {
            Swal.fire('Eliminado!', 'Producto eliminado...', 'success');
          },
          (error) => {
            this.mostrarError('Error al eliminar producto...');
          }
        );
      } else if (!result.isConfirmed || result.dismiss) {
        this.getProductos();
      }
    });
  }

  //Metodo cuando se presiona nuevo
  nuevo(){
    this.resetForm();
  }

  //Cargar imagen
  async newImageUpload(event:any){
    if (event.target.files && event.target.files[0]) {
      this.newFile=event.target.files[0];
      const reader= new FileReader();
      reader.onload=((image)=>{        
          this.newProducto.foto=image.target?.result as string;
          this.imgSrc= this.newProducto.foto;        
      });
      reader.readAsDataURL(event.target.files[0]);  
      this.seCargoFoto=true;
    }
    else{
       {
        this.newProducto.foto=this.imgSrc;
        this.seCargoFoto=false;
      }
    }    
  }
  
  //Metodo cuando presionamos el boton editar
  productoActual!:Producto;
  proActual(producto:Producto){    
    this.productoActual=producto;
    this.newProducto=producto;
    this.imgSrc=producto.foto;
    this.textoBoton='Actualizar producto'
  }
    
  //para gestionar la paginacion
  public page:number=0;
  nextPage(){
    this.page+=6;
  }

  prevPage(){
    if (this.page>0) {
      this.page-=6;      
    }
  }  
  
}
