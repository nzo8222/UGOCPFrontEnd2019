import { Component, OnInit } from '@angular/core';
import { FacadeService } from 'src/app/shared/services/facade.service';
import { DTOEmpresa, EstadoDTO, MunicipioDTO, LocalidadDTO, DTOidMunicipio, DTOidEstado, DTOPostDatosEmpresa } from 'src/app/shared/interfaces/DTO';
import { AuthService } from 'src/app/shared/guard/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {
  public formaEmpresa: FormGroup;
  public lstProductos: any;
  public lstEstado: EstadoDTO[];
  public lstMunicipios: MunicipioDTO[];
  public lstLocalidad: LocalidadDTO[];
  public listaGridEmpresas: DTOEmpresa[] = [];
  public idxSelectedItem: number;
  public selectedKeys: string[] = [];
  constructor(private facade: FacadeService, private authService: AuthService, private notificationService: NotificationService) { }

  ngOnInit() {
this.LoadListEmpresas();
this.loadEstadoList();
this.formaEmpresa = new FormGroup({
  'nombreEmpresa': new FormControl(null, [Validators.required]),
  'numeroTelefono': new FormControl(null, [Validators.required]),
  'direccion': new FormControl(null, [Validators.required]),
  'estado': new FormControl(null, [Validators.required]),
  'municipio': new FormControl(null, [Validators.required]),
  'localidad': new FormControl(null, [Validators.required])
})
  }
  loadEstadoList(){
    this.facade.GetEstados().subscribe(
      res => {
        if(!res.exitoso){
          this.notificationService.showError(res.mensajeError);
          console.log("Error obteniendo estados.");
          return;
        }
        const estados = res.payload as EstadoDTO[];

        this.lstEstado = estados;

        this.notificationService.showSuccess('Se cargaron las listas');
      });
  }

  OnClickObtenerMunicipios(){
    if(!this.lstEstado.find(e => e.nombre === this.formaEmpresa.value.estado))
    {
       this.notificationService.showError("Seleccione un estado valido.");
      return;
    }
    let Estado = this.lstEstado.find(e => e.nombre === this.formaEmpresa.value.estado);
    let idEstado: DTOidEstado = {
      id : Estado.id
    }
    this.facade.GetMunicipiosPorIdEstado(idEstado).subscribe(
      res => {
        if(!res.exitoso){
          this.notificationService.showError(res.mensajeError);
          return;
        }
        const listaMunicipios = res.payload as MunicipioDTO[];
        this.lstMunicipios = listaMunicipios;
        this.notificationService.showSuccess('Se cargaron los municipios');
      });
}  

  OnClickObtenerLocalidad(){
    if(!this.lstMunicipios.find(m => m.nombre === this.formaEmpresa.value.municipio))
    {
       this.notificationService.showError("Seleccione un municipio valido.");
      return;
    }
    let Municipio = this.lstMunicipios.find(e => e.nombre === this.formaEmpresa.value.municipio);
    let idMunicipio: DTOidMunicipio = {
      id : Municipio.id
    }
    this.facade.GetLocalidadPorIdMunicipio(idMunicipio).subscribe(
      res => {
        if(!res.exitoso){
          this.notificationService.showError(res.mensajeError);
          return;
        }
        const listaLocalidades = res.payload as LocalidadDTO[];
        this.lstLocalidad = listaLocalidades;
       this.notificationService.showSuccess('Se cargaron las localidades');
      }
    )
  }

  LoadListEmpresas(){
    let idUsuario = this.authService.getUserId();
    this.facade.GetListaEmpresas(idUsuario).subscribe(
      res =>
      {
        if(res.exitoso)
        {
          this.listaGridEmpresas = res.payload as DTOEmpresa[];
        }
        else
        {
          this.notificationService.showError("No se encontraron empresas para este usuario.");
        }
      }
    )
  }

  handleFilter(filter: any) {
    this.facade.GetListaProductosServiciosSAT(filter).subscribe(res => {
      this.lstProductos = res.payload;
    });
  }

  onSubmitFormaEmpresa() {
    if(!this.formaEmpresa.valid){
      return;
    }
    let localidad = this.lstLocalidad.find(l => l.nombre === this.formaEmpresa.value.localidad);
    let valoresEmpresa: DTOPostDatosEmpresa = {
      idUsuario : this.authService.getUserId(),
      name : this.formaEmpresa.value.nombreEmpresa,
      phoneNumber : this.formaEmpresa.value.numeroTelefono,
      address : this.formaEmpresa.value.direccion,
      idLocalidad: localidad.id
    }
    this.facade.PostEmpresaData(valoresEmpresa).subscribe(
      res => {
        if(res.exitoso){
          this.notificationService.showSuccess("Se guardaron los datos correctamente.");
          this.LoadListEmpresas();
        }
        else
        {
          this.notificationService.showError(res.mensajeError);
        }
      }
    )
    this.formaEmpresa.reset();
   
  }

}