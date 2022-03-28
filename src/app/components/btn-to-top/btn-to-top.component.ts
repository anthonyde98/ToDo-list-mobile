import { Component, OnInit, Input, Renderer2} from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'btn-to-top',
  template: 
  `<div class="btnTop">
    <button id="btn" class="btn">
      <ion-icon color="danger" name="chevron-up" (click)="content.scrollToTop(400);"></ion-icon>
    </button>
  </div>`,
  styleUrls: ['./btn-to-top.component.scss'],
})
export class BtnToTopComponent implements OnInit {
  @Input() content: IonContent;

  constructor() { }

  ngOnInit() {
  }
}
