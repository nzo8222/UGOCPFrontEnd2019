import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';
import { ProductoComponent } from './producto.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule } from '@progress/kendo-angular-grid';

@NgModule({
  declarations: [ProductoComponent],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    DropDownsModule,
    GridModule
  ]
})
export class ProductoModule { }
