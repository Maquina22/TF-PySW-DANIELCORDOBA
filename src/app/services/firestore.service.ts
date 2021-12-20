import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private database:AngularFirestore) { }

  //Metodo para crear un documento o registro
  createDoc(data:any, path:string, id:string){
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }

  //Metodo para eliminar un documento
  deleteDoc(path:string, id:string){
    const collection = this.database.collection(path);
    return collection.doc(id).delete();
  }

  //Metodo para actualizar un documento
  updateDoc(data:any, path:string, id:string){
    const collection = this.database.collection(path);
    return collection.doc(id).update(data);
  }

  //Metodo para obtener un ID
  getId(){
    return this.database.createId();
  }

  //Metodo para obtener un documento
  getDoc<tipo>(path:string, id:string){
    const collection = this.database.collection(path);
    return collection.doc(id).valueChanges();
  }

  //Metodo para obtener toda la coleccion
  getCollection<tipo>(path:string){
    const collection = this.database.collection<tipo>(path);
    return collection.valueChanges();
  }

}
