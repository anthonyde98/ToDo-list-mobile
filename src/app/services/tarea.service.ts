import { Injectable } from '@angular/core';
import { collection, addDoc, Firestore, collectionData, query, CollectionReference, updateDoc, doc, getDoc, docData, DocumentReference, deleteDoc } from '@angular/fire/firestore';
import { orderBy, where } from 'firebase/firestore';
import { Observable } from 'rxjs';

export interface Tarea {
  id?: string;
  titulo: string;
  contenido: string;
  fecha: string;
  estado: string;
  usuario?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private tarea!: Observable<Tarea>;

  constructor(private fire: Firestore) { }

  async agregarTarea(tarea: Tarea, uid: string){
    let task = collection(this.fire, 'tarea');

    tarea.usuario = uid;
    await addDoc(task, tarea);
  }

  obtenerTareas(uid: string): Observable<Tarea[]>{
    return collectionData<Tarea>(
      query<Tarea>(
        collection(this.fire, 'tarea') as CollectionReference<Tarea>, where('usuario', '==', uid), orderBy("fecha")
      ), {idField: 'id'}
    );
  }

  async actualizarTarea(datos: any, id: string){
    let task = doc(this.fire, 'tarea', id);

    await updateDoc(task, datos);
  }
  
  /*obtenerTareaCanal(id: string): Observable<Tarea>{
    return docData<Tarea>(
      doc(this.fire, "tarea", id) as DocumentReference<Tarea>, {idField: 'id'}
    );
  }*/

  async obtenerTarea(id: string){
    let task = doc(this.fire, 'tarea', id);

    let docSnap = await getDoc(task);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return false;
    }
  }

  async eliminarTarea(id: string){
    let task = doc(this.fire, 'tarea', id);

    await deleteDoc(task);
  }
}
