import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { ContactanosComponent } from './pages/contactanos/contactanos.component';
import { AdminComponent } from './pages/admin/admin.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { UserLoginService } from './service/user-login.service';
import { InventarioComponent } from './pages/inventario/inventario.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { MoradoPipe } from './pipes/morado.pipe';
import { SimbolodolarPipe } from './pipes/simbolodolar.pipe';
import { ShowHideDirective } from './directives/show-hide.directive';
import { ProvedoresComponent } from './pages/provedores/provedores.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    TiendaComponent,
    ContactanosComponent,
    AdminComponent,
    RegistroComponent,
    InventarioComponent,
    UsuariosComponent,
    MoradoPipe,
    SimbolodolarPipe,
    ShowHideDirective,
    ProvedoresComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [UserLoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
