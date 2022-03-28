import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { BackButtonEvent } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.backButtonHandler();
  }

  backButtonHandler(){
    document.addEventListener('ionBackButton', (ev: BackButtonEvent) => {
      ev.detail.register(-1, () => {
          App.exitApp();
      })
    })
  }
}
