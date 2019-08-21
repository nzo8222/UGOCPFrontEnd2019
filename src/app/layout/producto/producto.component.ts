import { Component, OnInit } from '@angular/core';
import { DTOEmpresa, DTOUpdateDatosEmpresa, DTOGetDatosProducto, Product } from 'src/app/shared/interfaces/DTO';
import { AuthService } from 'src/app/shared/guard/auth.service';
import { FacadeService } from 'src/app/shared/services/facade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  public listaGridEmpresas: DTOEmpresa[] = [];
  public idxSelectedItem: number;
  public selectedKeys: string[] = [];
  public listaGridProductos: Product[] = [];
  constructor(private facade: FacadeService, private authService: AuthService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.LoadListEmpresas();
  }
  LoadListEmpresas() {
    let idUsuario = this.authService.getUserId();
    this.facade.GetListaEmpresas(idUsuario).subscribe(
      res => {
        if (res.exitoso) {
          this.listaGridEmpresas = res.payload as DTOEmpresa[];
        }
        else {
          this.notificationService.showError("No se encontraron empresas para este usuario.");
        }
      }
    )
  }
  OnClickProducts() {
    if (!this.listaGridEmpresas) {
      this.notificationService.showError("Seleccioné una empresa valida.");
      return
    }
    if (!this.listaGridEmpresas.findIndex(e => e.idCompany === this.selectedKeys[0])) {
      this.notificationService.showError("Seleccioné una empresa valida.");
      return
    }

    const idx = this.listaGridEmpresas.findIndex(e => e.idCompany === this.selectedKeys[0]);
    if (idx > -1) { this.idxSelectedItem = idx; }
    if (this.idxSelectedItem > -1) {
      let empresaSeleccionada = this.listaGridEmpresas.find(e => e.idCompany === this.selectedKeys[0]);
      let empresa: DTOGetDatosProducto = {
        idUsuario: this.authService.getUserId(),
        idEmpresa: empresaSeleccionada.idCompany
      }
      this.facade.GetProductosEmpresa(empresa).subscribe(
        res => {
          if (!res.exitoso) {
            this.notificationService.showError(res.mensajeError);
            return;
          }
          const listaProductos = res.payload as Product[];
          this.listaGridProductos = listaProductos;
          this.notificationService.showSuccess('Se cargaron los productos correctamente');
        }
      )
    }
  }
}
