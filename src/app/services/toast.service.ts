import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) { }

  show(mensaje: string, tipo: string, duracion: number) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: duracion,
      position: "bottom",
      color: tipo
    }).then((toastData) => {
      toastData.present();
    });
  }
}

