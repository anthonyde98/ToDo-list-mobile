import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module';

import { InicioPage } from './inicio.page';
import { BtnToTopComponent } from 'src/app/components/btn-to-top/btn-to-top.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    InicioPageRoutingModule
  ],
  declarations: [InicioPage, BtnToTopComponent]
})
export class InicioPageModule {}
