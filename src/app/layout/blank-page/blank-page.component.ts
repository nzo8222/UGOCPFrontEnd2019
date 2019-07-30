import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EstadoDTO, DTOidEstado, MunicipioDTO, LocalidadDTO, DTOidMunicipio } from 'src/app/shared/interfaces/DTO';
import { FacadeService } from 'src/app/shared/services/facade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {
   public lstEstado: EstadoDTO[];
   public lstMunicipios: MunicipioDTO[];
   public lstLocalidad: LocalidadDTO[];
    formaUsuario: FormGroup;
    //private notifications: NotificationService
    constructor(private facadeService: FacadeService) {}
    OnClickObtenerLocalidad(){
      if(!this.lstMunicipios.find(m => m.nombre === this.formaUsuario.value.municipio))
      {
        // this.notifications.showError("Seleccione un municipio valido.");
        return;
      }
      let Municipio = this.lstMunicipios.find(e => e.nombre === this.formaUsuario.value.municipio);
      let idMunicipio: DTOidMunicipio = {
        id : Municipio.id
      }
      this.facadeService.GetLocalidadPorIdMunicipio(idMunicipio).subscribe(
        res => {
          if(!res.exitoso){
            //this.notifications.showError(res.mensajeError);
            return;
          }
          const listaLocalidades = res.payload as LocalidadDTO[];
          this.lstLocalidad = listaLocalidades;
          // this.notifications.showSuccess('Se cargaron las localidades');
        }
      )
    }
    ngOnInit() {
        this.loadEstadoList();
        this.formaUsuario = new FormGroup({
            'estado': new FormControl(null, [Validators.required]),
            'municipio': new FormControl(null, [Validators.required]),
            'localidad': new FormControl(null, [Validators.required])
        })
    }
    loadEstadoList(){
        this.facadeService.GetEstados().subscribe(
          res => {
            if(!res.exitoso){
            //   this.notifications.showError(res.mensajeError);
              console.log("Error obteniendo estados.");
              return;
            }
            const estados = res.payload as EstadoDTO[];
    
            this.lstEstado = estados;
    
            // this.notifications.showSuccess('Se cargaron las listas');
          });
      }
      OnClickObtenerMunicipios(){
          if(!this.lstEstado.find(e => e.nombre === this.formaUsuario.value.estado))
          {
            // this.notifications.showError("Seleccione un estado valido.");
            return;
          }
          let Estado = this.lstEstado.find(e => e.nombre === this.formaUsuario.value.estado);
          let idEstado: DTOidEstado = {
            id : Estado.id
          }
          this.facadeService.GetMunicipiosPorIdEstado(idEstado).subscribe(
            res => {
              if(!res.exitoso){
                // this.notifications.showError(res.mensajeError);
                return;
              }
              const listaMunicipios = res.payload as MunicipioDTO[];
              this.lstMunicipios = listaMunicipios;
              // this.notifications.showSuccess('Se cargaron los municipios');
            });
      }  
    onSubmitFormaUsuario(){

    }
}
