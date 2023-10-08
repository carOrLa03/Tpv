import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from './components/components.module';
import { TpvServicioService } from './services/tpv-servicio.service';
import { TpvComponent } from './tpv/tpv.component';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';






@NgModule({
  declarations: [
    AppComponent,
    TpvComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    AppRoutingModule,
    MenubarModule,
    ButtonModule,
    CardModule
  ],
  providers: [
    TpvServicioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
