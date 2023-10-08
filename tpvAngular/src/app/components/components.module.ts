import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IframeTpvComponent } from './iframe-tpv/iframe-tpv.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    IframeTpvComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    RouterModule
  ],
  exports: [
    IframeTpvComponent
  ]
})
export class ComponentsModule { }
