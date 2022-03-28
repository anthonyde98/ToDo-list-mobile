import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
  transform(val:string, param:string):string {
    return val.split(param)[0];
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  usuario: any;

  constructor(private usuarioService: UsuarioService, private router: Router) { 
    this.usuario = {
      uid: "",
      email: ""
    }
  }

  ngOnInit() {
    this.usuarioService.obtenerUsuarioActual().subscribe(data => {
      this.usuario = data;
    })
  }

  cerrarSesion(){
    this.usuarioService.cerrarSesion().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true} )
    });
  }
}
