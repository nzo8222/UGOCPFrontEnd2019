import { Component, OnInit } from '@angular/core';
import { DTOEmpresa, DTOUpdateDatosEmpresa, DTOGetDatosProducto, Product, DTOClaveProdServ, DTOPostDatosProducto, DTOUpdateDatosProducto, DTODeleteDatosProducto } from 'src/app/shared/interfaces/DTO';
import { AuthService } from 'src/app/shared/guard/auth.service';
import { FacadeService } from 'src/app/shared/services/facade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  public formaProducto: FormGroup;
  public listaGridEmpresas: DTOEmpresa[] = [];
  public idxSelectedItem: number;
  public selectedKeysEmpresa: string[] = [];
  public selectedKeysProducto: string[] = [];
  public listaGridProductos: Product[] = [];
  public lstProductos: DTOClaveProdServ[];
  empresaSeleccionada: string[] = [];
  calidad = ['Organico', 'No Organico'];
  public nombreEmpresaSeleccionada: string = "";
  constructor(private facade: FacadeService, private authService: AuthService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.LoadListEmpresas();
    this.formaProducto = new FormGroup({
      'nombreProducto': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_ ]*$'), Validators.minLength(5), Validators.maxLength(50)]),
      'claveProducto': new FormControl(null, [Validators.required]),
      'calidad': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(5), Validators.maxLength(50)]),
      'inicioDeCosecha': new FormControl(null, [Validators.required]),
      'finDeCosecha': new FormControl(null, [Validators.required]),
      'CantidadEnKG': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(7)])
    })
  }
  OnClickDeleteProducto()
  {
    if(!this.empresaSeleccionada[0])
    {
      this.notificationService.showError("Es necesario dar click en ver productos de la empresa para agregar productos.");
      return;
    }
    var empresaDelete = this.listaGridEmpresas.find(e => e.idCompany === this.empresaSeleccionada[0]);
    var productoDelete = this.listaGridProductos.find(e => e.idProduct === this.selectedKeysProducto[0]);
    if(!productoDelete)
    {
      this.notificationService.showError("Seleccione un producto.");
      return;
    }
    let datosProducto: DTODeleteDatosProducto = {
    idProducto : productoDelete.idProduct,
    idEmpresa : empresaDelete.idCompany,
    idUsuario : this.authService.getUserId()
    };
    this.facade.DeleteProductoData(datosProducto).subscribe(
      res => {
        if(res.exitoso)
        {
          this.notificationService.showSuccess("Se borro el producto correctamente.");
          this.LoadListProducts();
          this.formaProducto.reset();
        }
        else
        {
          this.notificationService.showError(res.mensajeError);
        }
      }
    );
    this.selectedKeysProducto = [];
  }
  OnClickUpdateProducto()
  {
    if (!this.formaProducto.valid) {
      return;
    }
    if(!this.empresaSeleccionada[0])
    {
      this.notificationService.showError("Es necesario dar click en ver productos de la empresa para agregar productos.");
      return;
    }
    let empresa = this.listaGridEmpresas.find(e => e.idCompany === this.empresaSeleccionada[0]);
    let producto = this.listaGridProductos.find(e => e.idProduct === this.selectedKeysProducto[0]);
    if(!empresa)
    {
      this.notificationService.showError("Seleccione una empresa valida");
      return;
    }
    let categoriaSat = this.lstProductos.find(p => p.descripcion === this.formaProducto.value.claveProducto)
    let datosProductos : DTOUpdateDatosProducto = {
      idProducto : producto.idProduct,
      idUsuario : this.authService.getUserId(),
      idEmpresa : empresa.idCompany,
      name : this.formaProducto.value.nombreProducto,
      calidad : this.formaProducto.value.calidad,
      startOfHarvest : this.formaProducto.value.inicioDeCosecha,
      endOfHarvest : this.formaProducto.value.finDeCosecha,
      cuantityInKG : this.formaProducto.value.CantidadEnKG,
      claveProductoServicio : categoriaSat.codigo
    }
    this.facade.UpdateProductoData(datosProductos).subscribe(
      res => {
        if(res.exitoso)
        {
          this.notificationService.showSuccess("Se guardaron los datos correctamente.");
          this.LoadListProducts();
          this.formaProducto.reset();
        }
        else{
          this.notificationService.showError(res.mensajeError);
        }
      }
    );
    this.selectedKeysProducto = [];
  }
  OnSubmitFormaProducto()
  {
    if (!this.formaProducto.valid) {
      return;
    }
    if(!this.empresaSeleccionada[0])
    {
      this.notificationService.showError("Es necesario dar click en ver productos de la empresa para agregar productos.");
      return;
    }
    let empresa = this.listaGridEmpresas.find(e => e.idCompany === this.empresaSeleccionada[0]);
    if(!empresa)
    {
      this.notificationService.showError("Seleccione una empresa valida");
      return;
    }
    let categoriaSat = this.lstProductos.find(p => p.descripcion === this.formaProducto.value.claveProducto)
    let datosProductos : DTOPostDatosProducto = {
      idUsuario : this.authService.getUserId(),
      idEmpresa : empresa.idCompany,
      name : this.formaProducto.value.nombreProducto,
      calidad : this.formaProducto.value.calidad,
      startOfHarvest : this.formaProducto.value.inicioDeCosecha,
      endOfHarvest : this.formaProducto.value.finDeCosecha,
      cuantityInKG : this.formaProducto.value.CantidadEnKG,
      claveProductoServicio : categoriaSat.codigo
    }
    this.facade.PostProductoData(datosProductos).subscribe(
      res => {
        if(res.exitoso)
        {
          this.notificationService.showSuccess("Se guardo el producto correctamente");
          this.OnClickProducts();
          this.formaProducto.reset();
        }
        else
        {
          this.notificationService.showError(res.mensajeError);
        }
      }
    )
    this.formaProducto.reset();
    this.selectedKeysProducto = [];
  }

  handleFilter(filter: any) {
    this.facade.GetListaProductosServiciosSAT(filter).subscribe(res => {
      this.lstProductos = res.payload;
    });
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
  LoadListProducts()
  {
    let empresa: DTOGetDatosProducto = {
      idUsuario: this.authService.getUserId(),
      idEmpresa: this.empresaSeleccionada[0]
    }
    this.facade.GetProductosEmpresa(empresa).subscribe(
      res => {
        if (!res.exitoso) {
          this.notificationService.showError(res.mensajeError);
          this.listaGridProductos = [];
          return;
        }
        const listaProductos = res.payload;
        this.listaGridProductos = [];
        this.listaGridProductos = listaProductos;
        this.notificationService.showSuccess('Se cargaron los productos correctamente');
      }
    );
  }
  
  OnClickProducts() {
    if (!this.listaGridEmpresas) {
      this.notificationService.showError("Seleccioné una empresa valida.");
      return
    }
    // if (!this.listaGridEmpresas.findIndex(e => e.idCompany === this.selectedKeys[0])) {
    //   this.notificationService.showError("Seleccioné una empresa valida.");
    //   return
    // }
    
    const idx = this.listaGridEmpresas.findIndex(e => e.idCompany === this.selectedKeysEmpresa[0]);
    let empresa = this.listaGridEmpresas.find(e => e.idCompany === this.selectedKeysEmpresa[0]);
    this.nombreEmpresaSeleccionada = empresa.name;
    if (idx > -1) { this.idxSelectedItem = idx; }
    if (this.idxSelectedItem > -1) {
      let empresaSeleccionadaLocal = this.listaGridEmpresas.find(e => e.idCompany === this.selectedKeysEmpresa[0]);
      let empresa: DTOGetDatosProducto = {
        idUsuario: this.authService.getUserId(),
        idEmpresa: empresaSeleccionadaLocal.idCompany
      }
      this.facade.GetProductosEmpresa(empresa).subscribe(
        res => {
          if (res.exitoso) {
            const listaProductos = res.payload;
          this.listaGridProductos = [];
          this.listaGridProductos = listaProductos;
          this.notificationService.showSuccess('Se cargaron los productos correctamente');
          }
          else{
            this.notificationService.showError(res.mensajeError);
          }
        }
      )
    }
    this.empresaSeleccionada = this.selectedKeysEmpresa;
    this.selectedKeysEmpresa = [];
  }
}
