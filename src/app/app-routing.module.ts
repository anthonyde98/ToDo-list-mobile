import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
const redirectLoggedInToInicio = () => redirectLoggedInTo(['/inicio']);

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToInicio)
  },
  {
    path: 'inicio', 
    loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '**', pathMatch: 'full', redirectTo: 'login',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
