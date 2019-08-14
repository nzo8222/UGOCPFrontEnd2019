import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaComponent } from './empresa.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';
 
@NgModule({
  declarations: [EmpresaComponent],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    ReactiveFormsModule,
    DropDownsModule,
    GridModule
  ]
})
export class EmpresaModule { }
