import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alert: AlertController) { }

  async show(title, msg, type){
    const alert = await this.alert.create({
      header: title,
      message: msg,
      buttons: ['OK'],
      cssClass: type == 'error' ? 'custom-alert-danger' : type == 'warning' ? 'custom-alert-warning' : 'custom-alert-success'
    });

    await alert.present();
  }
}