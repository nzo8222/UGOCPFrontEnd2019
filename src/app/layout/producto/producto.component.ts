import { Component, OnInit } from '@angular/core';
import { DTOEmpresa, DTOUpdateDatosEmpresa, DTOGetDatosProducto, Product, DTOClaveProdServ, DTOPostDatosProducto, DTOUpdateDatosProducto, DTODeleteDatosProducto, DTODatosClaveProductoServicioSat, ProductConNombreMes } from 'src/app/shared/interfaces/DTO';
import { AuthService } from 'src/app/shared/guard/auth.service';
import { FacadeService } from 'src/app/shared/services/facade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Key } from 'protractor';

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
  public listaGridProductos: ProductConNombreMes[] = []; //ConNombreMes
  public lstProductos: DTOClaveProdServ[];
  empresaSeleccionada: string[] = [];
  calidad = ['Organico', 'No Organico'];
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  mesesSeleccionados: String[] = [];
  public nombreEmpresaSeleccionada: string = "";
  constructor(private facade: FacadeService, private authService: AuthService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.LoadListEmpresas();
    this.formaProducto = new FormGroup({
      'nombreProducto': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_ ]*$'), Validators.minLength(5), Validators.maxLength(50)]),
      'claveProducto': new FormControl(null, [Validators.required]),
      'calidad': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(5), Validators.maxLength(50)]),
      'MesesDeCosecha': new FormControl(null, []),
      'CantidadEnKG': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(7)])
    })
  }
  OnClickMes(mes) {
    this.mesesSeleccionados.push(mes);
  }
  OnClickCargarDatosProducto() {
    if (!this.listaGridProductos) {
      this.notificationService.showError("Seleccioné un producto valido.");
    }
    if (!this.listaGridProductos.find(p => p.name === this.selectedKeysProducto[0])) {
      this.notificationService.showError("Seleccioné un producto valido.");
    }
    let producto = this.listaGridProductos.find(p => p.name === this.selectedKeysProducto[0]);
    this.formaProducto.controls['nombreProducto'].patchValue(producto.name);
    this.formaProducto.controls['calidad'].patchValue(producto.calidad);
    // this.formaProducto.controls['inicioDeCosecha'].patchValue(this.formatDate(producto.startOfHarvest));
    // this.formaProducto.controls['finDeCosecha'].patchValue(this.formatDate(producto.endOfHarvest));
    this.formaProducto.controls['CantidadEnKG'].patchValue(producto.cuantityInKG);
    this.facade.GetNombreProductoSat(producto.claveProductoServicio).subscribe(
      res => {
        if (res.exitoso) {
          let datosProductoServicio = res.payload as DTODatosClaveProductoServicioSat;
          this.formaProducto.controls['claveProducto'].patchValue(datosProductoServicio.descripcion);
          this.notificationService.showSuccess("Se cargo los datos del producto correctamente.");
        } else {
          this.notificationService.showError(res.mensajeError);
        }
      }
    );
  }
  // private formatDate(date) {
  //   const d = new Date(date);
  //   let month = '' + (d.getMonth() + 1);
  //   let day = '' + d.getDate();
  //   const year = d.getFullYear();
  //   if (month.length < 2) month = '0' + month;
  //   if (day.length < 2) day = '0' + day;
  //   return [year, month, day].join('-');
  // }
  OnClickDeleteProducto() {
    if (!this.empresaSeleccionada[0]) {
      this.notificationService.showError("Es necesario dar click en ver productos de la empresa para agregar productos.");
      return;
    }
    var empresaDelete = this.listaGridEmpresas.find(e => e.name === this.empresaSeleccionada[0]);
    var productoDelete = this.listaGridProductos.find(e => e.name === this.selectedKeysProducto[0]);
    if (!productoDelete) {
      this.notificationService.showError("Seleccione un producto.");
      return;
    }
    let datosProducto: DTODeleteDatosProducto = {
      idProducto: productoDelete.idProduct,
      idEmpresa: empresaDelete.idCompany,
      idUsuario: this.authService.getUserId()
    };
    this.facade.DeleteProductoData(datosProducto).subscribe(
      res => {
        if (res.exitoso) {
          this.notificationService.showSuccess("Se borro el producto correctamente.");
          this.LoadListProducts();
          this.formaProducto.reset();
        }
        else {
          this.notificationService.showError(res.mensajeError);
        }
      }
    );
    this.selectedKeysProducto = [];
  }
  OnClickUpdateProducto() {
    if (!this.formaProducto.valid) {
      return;
    }
    if (!this.empresaSeleccionada[0]) {
      this.notificationService.showError("Es necesario dar click en ver productos de la empresa para agregar productos.");
      return;
    }
    let empresa = this.listaGridEmpresas.find(e => e.name === this.empresaSeleccionada[0]);
    let producto = this.listaGridProductos.find(e => e.name === this.selectedKeysProducto[0]);
    if (!empresa) {
      this.notificationService.showError("Seleccione una empresa valida");
      return;
    }
    let categoriaSat = this.lstProductos.find(p => p.descripcion === this.formaProducto.value.claveProducto)
    let datosProductos: DTOUpdateDatosProducto = {
      idProducto: producto.idProduct,
      idUsuario: this.authService.getUserId(),
      idEmpresa: empresa.idCompany,
      name: this.formaProducto.value.nombreProducto,
      calidad: this.formaProducto.value.calidad,
      startOfHarvest: this.formaProducto.value.inicioDeCosecha,
      endOfHarvest: this.formaProducto.value.finDeCosecha,
      cuantityInKG: this.formaProducto.value.CantidadEnKG,
      claveProductoServicio: categoriaSat.codigo,
      descripcionProductoServicio: categoriaSat.descripcion
    }
    this.facade.UpdateProductoData(datosProductos).subscribe(
      res => {
        if (res.exitoso) {
          this.notificationService.showSuccess("Se guardaron los datos correctamente.");
          this.LoadListProducts();
          this.formaProducto.reset();
        }
        else {
          this.notificationService.showError(res.mensajeError);
        }
      }
    );
    this.selectedKeysProducto = [];
  }
  OnSubmitFormaProducto() {
    if (!this.formaProducto.valid) {
      return;
    }
    if (!this.empresaSeleccionada[0]) {
      this.notificationService.showError("Es necesario dar click en ver productos de la empresa para agregar productos.");
      return;
    }
    let empresa = this.listaGridEmpresas.find(e => e.name === this.empresaSeleccionada[0]);
    if (!empresa) {
      this.notificationService.showError("Seleccione una empresa valida");
      return;
    }
    let categoriaSat = this.lstProductos.find(p => p.descripcion === this.formaProducto.value.claveProducto)
    let datosProductos: DTOPostDatosProducto = {
      idUsuario: this.authService.getUserId(),
      idEmpresa: empresa.idCompany,
      name: this.formaProducto.value.nombreProducto,
      calidad: this.formaProducto.value.calidad,
      monthsOfHarvest: this.mesesSeleccionados,
      cuantityInKG: this.formaProducto.value.CantidadEnKG,
      claveProductoServicio: categoriaSat.codigo,
      descripcionProductoServicio: categoriaSat.descripcion
    }
    this.facade.PostProductoData(datosProductos).subscribe(
      res => {
        if (res.exitoso) {
          this.notificationService.showSuccess("Se guardo el producto correctamente");
          this.OnClickProducts();
          this.formaProducto.reset();
        }
        else {
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
    );
  }
  LoadListProducts() {
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
        this.listaGridProductos = [];
        const listaProductos = res.payload as Product[];
        console.log(res);
        for (let index = 0; index < listaProductos.length; index++) {
          this.listaGridProductos[index].calidad = listaProductos[index].calidad;
          this.listaGridProductos[index].claveProductoServicio = listaProductos[index].claveProductoServicio;
          this.listaGridProductos[index].cuantityInKG = listaProductos[index].cuantityInKG;
          this.listaGridProductos[index].idProduct = listaProductos[index].idProduct;
          this.listaGridProductos[index].name = listaProductos[index].name;

          listaProductos[index].lstMonthsOfHarvest.forEach(element => {
            this.listaGridProductos[index].months.push(element);
            this.listaGridProductos[index].monthsName += element.name
          });

        }
        this.notificationService.showSuccess('Se cargaron los productos correctamente 2222222');
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

    const idx = this.listaGridEmpresas.findIndex(e => e.name === this.selectedKeysEmpresa[0]);
    let empresa = this.listaGridEmpresas.find(e => e.name === this.selectedKeysEmpresa[0]);
    this.nombreEmpresaSeleccionada = empresa.name;
    if (idx > -1) { this.idxSelectedItem = idx; }
    if (this.idxSelectedItem > -1) {
      let empresaSeleccionadaLocal = this.listaGridEmpresas.find(e => e.name === this.selectedKeysEmpresa[0]);
      let empresa: DTOGetDatosProducto = {
        idUsuario: this.authService.getUserId(),
        idEmpresa: empresaSeleccionadaLocal.idCompany
      }
      this.facade.GetProductosEmpresa(empresa).subscribe(
        res => {
          if (res.exitoso) {
            const listaProductos = res.payload as Product[];
            this.listaGridProductos = [];


            listaProductos.forEach(p => {

              let months = '';
              p.lstMonthsOfHarvest.forEach(m => {
               months += ' ' + m.name;
              });


              this.listaGridProductos.push({
                calidad: p.calidad,
                claveProductoServicio: p.claveProductoServicio,
                name: p.name,
                cuantityInKG: p.cuantityInKG,
                idProduct: p.idProduct,
                months: null,
                monthsName: months,
                descripcionProductoServicio: p.descripcionProductoServicio
              })
            });
            this.notificationService.showSuccess('Se cargaron los productos correctamente');
          }
          else {
            this.notificationService.showError(res.mensajeError);
          }
        }
      )
    }
    this.empresaSeleccionada = this.selectedKeysEmpresa;
    this.selectedKeysEmpresa = [];
  }
}
