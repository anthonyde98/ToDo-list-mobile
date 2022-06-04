import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Tarea, TareaService } from 'src/app/services/tarea.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { IonContent, LoadingController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  listForm!: FormGroup;
  tareas!: Observable<any>;
  tareaInfo: any;
  tareaEdit: any;
  infoComponent: boolean = false;
  formAccion: boolean = true;
  usuario: any;
  setForm: boolean = false;
  screen: boolean = false;
  scroll: boolean = false;
  accion: number = null;

  @ViewChild(IonContent) content: IonContent;

  constructor(private fb: FormBuilder, private tareaService: TareaService, private toast: ToastService,
    private usuarioService: UsuarioService, private load: LoadingController) {
    
    this.usuario = {
      uid: "",
      email: ""
    }

    this.usuarioService.obtenerUsuarioActual().subscribe(data => {
      this.usuario = data;
      if(this.usuario != null)
        this.tareas = this.tareaService.obtenerTareas(this.usuario.uid);
    })

    this.listForm = this.fb.group({
      titulo: ["", [Validators.minLength(2), Validators.required]],
      contenido: ["", [Validators.minLength(3), Validators.required]],
      fecha: ["", [Validators.required]]
    })

    this.tareaInfo = this.tareaEdit = {
      titulo: "",
      contenido: "",
      fecha: "",
      index: ""
    }
   }

  ngOnInit(){
    this.screen = document.body.clientWidth > 700;
  }

  async setTarea(){
    const loading = await this.load.create();
    await loading.present();

    if(this.listForm.invalid){
      loading.dismiss();
      return
    }

    let tarea: Tarea = this.listForm.value;

    if(this.formAccion){

      this.actualizarTarea(true, this.listForm.value, this.tareaEdit.id)
    }
    else{
      tarea.estado = 'N';

      this.tareaService.agregarTarea(tarea, this.usuario.uid).then(() => {
        loading.dismiss();
        this.toast.show("La tarea fue agregada con exito.", 'success', 3000);
      }).catch(error => {
        loading.dismiss();
        this.toast.show("Hubo un error al agregar la tarea.", 'danger', 3000);
      }).finally(() => {
        this.listForm.reset();
        loading.dismiss();
      })
    }
  }

  obtenerTarea(opcion: boolean, id?: string, i?: number){
    this.tareaService.obtenerTarea(id || "").then(data => {
      if(opcion){
        this.tareaInfo = data;
        this.infoComponent = true;
        this.setToTop();
        this.tareaInfo.index = i;
      }
      else{
        this.tareaEdit = data;
        this.tareaEdit.id = id;
        this.tareaEdit.index = i;
        this.listForm.patchValue({
          titulo: this.tareaEdit.titulo,
          contenido: this.tareaEdit.contenido,
          fecha: this.tareaEdit.fecha
        })
      }
    }, 
      error => this.toast.show("Hubo un error al obtener la tarea.", 'danger', 3000)
    )
  }

  actualizarTarea(opcion: boolean, dato?: any, id?: string){
    let datos;
    let mensaje = "";

    if(!opcion){
      datos = {
        estado: dato
      }
      mensaje = "cambiada a ";
      if(dato == 'R')
        mensaje += "realizada";
      else if(dato == 'P')
        mensaje += "en proceso";
      else
        mensaje += "no realizada";
    }
    else{
      datos = this.listForm.value;
      mensaje = "editada";
    }

    this.tareaService.actualizarTarea(datos, id || "").then(() => {
      this.toast.show(`La tarea fue ${mensaje} exitosamente.`, 'success', 3000);
    }).catch(error => {
      this.toast.show("Hubo un error al editar la tarea.", 'danger', 3000);
    }).finally(() => {
      if(opcion){  
        this.load.dismiss()
        setTimeout(() => {
          this.listForm.reset()
          this.formAccion = false;
          this.setForm = false;
        }, 500);
      }
    })
  }

  eliminarTarea(id?: string){
    this.tareaService.eliminarTarea(id || "").then(() => {
      this.toast.show("La tarea fue eliminada con exito.", 'success', 3000);
    }).catch(error => {
      this.toast.show("Hubo un error al eliminar la tarea.", 'danger', 3000);
      console.log(error)
    })
  }

  setActualizacionForm(id?: string, i?: number){

    this.formAccion = this.tareaEdit.index === i ? false : true;

    if(this.formAccion){
      this.obtenerTarea(false, id, i);
      this.setForm = true; this.tran('form');
      this.setToTop();
    }
    else if(!this.formAccion){
      this.emptyActForm(i);
    }
  }

  emptyActForm(i?){
    this.tareaEdit = {};
    this.tareaEdit.index = "";
    this.listForm.reset();
    this.setForm = false;
    this.formAccion = true;
  }

  setInfoComponent(id?: string, i?:number){
    if(this.infoComponent && this.tareaInfo.index == i){
      this.infoComponent = false;
      this.tareaInfo = undefined;
    }
    else{
      this.obtenerTarea(true, id, i);
    }

  }

  estiloInput(inputName: string): string{
    let resp = "";

    if(this.listForm.get(inputName)?.invalid && this.listForm.get(inputName)?.touched)
      resp ="danger";
    else if(this.listForm.get(inputName)?.valid && this.listForm.get(inputName)?.touched) 
      resp = "success";
    
    return resp;
  }

  setScroll(event){
    this.scroll = event.detail.scrollTop > 0;
    this.removeAccion(this.accion);
  }

  setToTop(){
    this.content.scrollToTop(400);
  }

  tran(id){
    setTimeout(() => {
      document.getElementById(id).setAttribute('style', 'opacity: 1');
    }, 1);
  }

  displayAccion(i){
    if(document.getElementsByClassName("acc").item(i).hasAttribute("style")){
      this.removeAccion(i);
    }
    else{
      this.removeAccion(this.accion);
      this.accion = i;
      document.getElementsByClassName("acc").item(i).setAttribute("style", "display: block;");
    }
  }

  removeAccion(i){
    document.getElementsByClassName("acc").item(i).removeAttribute("style");
  }
}
