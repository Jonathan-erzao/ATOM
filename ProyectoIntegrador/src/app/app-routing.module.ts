import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { ContactanosComponent } from './pages/contactanos/contactanos.component';
import { AdminComponent } from './pages/admin/admin.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ProvedoresComponent } from './pages/provedores/provedores.component';

const routes: Routes = [
  { path: '', redirectTo: '/tienda', pathMatch: 'full' }, // Redirige a la tienda en lugar de inicio
  { path: 'inicio', component: HeaderComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'contactanos', component: ContactanosComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'provedores', component: ProvedoresComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
