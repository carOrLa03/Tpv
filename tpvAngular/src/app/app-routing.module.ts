import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TpvComponent } from './tpv/tpv.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: TpvComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
