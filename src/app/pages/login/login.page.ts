import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuarioForm: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, 
    private route: Router, private alert: AlertService, private load: LoadingController) {
    this.usuarioForm = this.fb.group({
      correo: ["", [Validators.email, Validators.required]],
      contrasena: ["", [Validators.required, Validators.minLength(6)]]
    })
   }

  ngOnInit() {
    this.fixedKeyboardBug();
  }

  async iniciarSesion(){
    const loading = await this.load.create();
    await loading.present();
    
    if(this.usuarioForm.invalid){
      loading.dismiss();
      return;
    }

    this.usuarioService.iniciarSesion(this.usuarioForm.value).then(() => {
      loading.dismiss();
      this.route.navigateByUrl('inicio', { replaceUrl: true });
    }).catch(error => {
      loading.dismiss();

      let configprincipal: any;

      if(error.code == 'auth/user-not-found'){
        this.alert.show('Inicio de sesión', 'Este usuario no fue encontrado.', 'error');
        configprincipal = {
          type: ['danger'], 
          items: ['email-icon', 'email', 'pass-icon', 'pass', 'user'],
          time: 5000
        };
      }
      else if(error.code == 'auth/wrong-password'){
        this.alert.show('Inicio de sesión', 'Contraseña incorrecta.', 'error')
        configprincipal = {
          type: ['danger'], 
          items: [ 'pass-icon', 'pass'],
          time: 5000
        };
      }
      else if(error.code == 'auth/too-many-requests'){
        this.alert.show('Inicio de sesión', 
        'El acceso a esta cuenta ha sido temporalmente deshabilitado debido a demasiados intentos fallidos. Espere 1 minuto para intentar de nuevo.',
        'warning')
        configprincipal = {
          type: ['warning'], 
          items: ['email-icon', 'email', 'pass-icon', 'pass', 'user'],
          time: 60000
        };
      }
      else
        this.alert.show('Error', 'Hubo un error al iniciar sesion.', 'error')

      this.alerta2Color(configprincipal.type, configprincipal.items);
      this.turnBlackInTime(configprincipal.items, configprincipal.time)
    })
  }

  async registrarUsuario(){
    const loading = await this.load.create();
    await loading.present();

    if(this.usuarioForm.invalid){
      loading.dismiss();
      return;
    }

    this.usuarioService.registarUsuario(this.usuarioForm.value).then(() =>{
      loading.dismiss();
      this.route.navigateByUrl('inicio', { replaceUrl: true });
    }).catch(error => {
      console.log(error);
      loading.dismiss();
      if(error.code == 'auth/email-already-in-use'){
        this.alert.show( 'Registro', 'Este correo esta ya en uso.','error')
        this.alerta2Color(['danger', 'danger', 'dark', 'dark'], ['email-icon', 'email', 'pass-icon', 'pass']);
        this.turnBlackInTime(['email-icon', 'email'], 5000)
      }
      else
        this.alert.show('Error', 'Hubo un error al registrar este usuario', 'error')
    })
  }
  
  estiloInput(inputName: string): string{
    let resp = "";

    if(this.usuarioForm.get(inputName)?.invalid && this.usuarioForm.get(inputName)?.touched)
      resp ="danger";
    else if(this.usuarioForm.get(inputName)?.valid && this.usuarioForm.get(inputName)?.touched) 
      resp = "success";
    else
      resp = "dark";
      
    return resp;
  }
  
  alerta2Color = (color: string[], name: string[]) => {
    if(color.length == 1)
      for(let i = 0; i < name.length; i++)
        document.getElementById(name[i])?.setAttribute('color', `${color[0]}`)
    else 
      for(let i = 0; i < name.length; i++)
        document.getElementById(name[i])?.setAttribute('color', `${color[i]}`)
  }

  turnBlackInTime = (name: string[], timeOut: number) => {
    setTimeout(() => {
      this.alerta2Color(['dark'], name);
     }, timeOut);
  }

  fixedKeyboardBug(){
    let mb;

    Keyboard.addListener('keyboardWillShow', (info: any) => {
      mb = document.getElementById("content").style.marginBottom;
      document.getElementById("content").style.marginBottom = info.keyboardHeight + "px";
    });
    
    Keyboard.addListener('keyboardWillHide', () => {
      document.getElementById("content").style.marginBottom = mb;
    });
  }
}
