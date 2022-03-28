import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface Usuario {
  uid?: string;
  correo: string;
  contrasena?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioActual!: Observable<Usuario | null>;

  constructor(private auth: Auth) {
    this.usuarioActual = new Observable((observer: any) =>
      onAuthStateChanged(auth, observer)
    );
  }

  obtenerUsuarioActual(): Observable<Usuario | null>{
    return this.usuarioActual;
  }

  async registarUsuario(usuario: Usuario){
    const credenciales = await createUserWithEmailAndPassword(this.auth, usuario.correo, usuario.contrasena || "")
    
    return credenciales;
  }

  async iniciarSesion(usuario: Usuario){
    return await signInWithEmailAndPassword(this.auth, usuario.correo, usuario.contrasena || "")
  }

  async cerrarSesion(){
    await signOut(this.auth)
  }
}
