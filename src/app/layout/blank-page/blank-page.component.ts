import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EstadoDTO } from 'src/app/shared/interfaces/DTO';
import { FacadeService } from 'src/app/shared/services/facade.service';

@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {
   public lstEstado: EstadoDTO[];
    formaUsuario: FormGroup;
    constructor(private facadeService: FacadeService) {}

    ngOnInit() {
        this.loadEstadoList();
        this.formaUsuario = new FormGroup({
            'estado': new FormControl(null, [Validators.required]),
            'municipio': new FormControl(null, [Validators.required]),
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
          
      }  
    onSubmitFormaUsuario(){

    }
}
