import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EstadoDTO, DTOidEstado, MunicipioDTO, LocalidadDTO, DTOidMunicipio, DTODatosUsuario, DTODatosUsuarioConLocalidad } from 'src/app/shared/interfaces/DTO';
import { FacadeService } from 'src/app/shared/services/facade.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/shared/guard/auth.service';

@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {
   public lstEstado: EstadoDTO[];
   public lstMunicipios: MunicipioDTO[];
   public lstLocalidad: LocalidadDTO[];
   generos = ['Masculino', 'Femenino'];
   estadoCivil = ['Casado', 'Soltero'];
   formaUsuario: FormGroup;
   public datosUsuario: DTODatosUsuarioConLocalidad;
   public esperawe : boolean = false;

    constructor(private facadeService: FacadeService, private authService: AuthService, private notifications: NotificationService) {}

    OnClickObtenerLocalidad(){
      if(!this.lstMunicipios.find(m => m.nombre === this.formaUsuario.value.municipio))
      {
         this.notifications.showError("Seleccione un municipio valido.");
        return;
      }
      let Municipio = this.lstMunicipios.find(e => e.nombre === this.formaUsuario.value.municipio);
      let idMunicipio: DTOidMunicipio = {
        id : Municipio.id
      }
      this.facadeService.GetLocalidadPorIdMunicipio(idMunicipio).subscribe(
        res => {
          if(!res.exitoso){
            this.notifications.showError(res.mensajeError);
            return;
          }
          const listaLocalidades = res.payload as LocalidadDTO[];
          this.lstLocalidad = listaLocalidades;
         this.notifications.showSuccess('Se cargaron las localidades');
        }
      );
    }
    GetDatosUsuario()
    {
      this.facadeService.GetDatosUsuario(this.authService.getUserId()).subscribe(
        res => {
          if(res.exitoso)
          {
            this.datosUsuario = res.payload as DTODatosUsuarioConLocalidad;
            this.notifications.showSuccess("Se cargaron los datos del usuario correctamente.");
            this.formaUsuario.controls['nombreCompletoUsuario'].patchValue(this.datosUsuario.fullName);
            this.formaUsuario.controls['direccion'].patchValue(this.datosUsuario.address);
            this.formaUsuario.controls['telefono'].patchValue(this.datosUsuario.phoneNumber);
            this.formaUsuario.controls['celular'].patchValue(this.datosUsuario.cellPhone);
            this.formaUsuario.controls['fechaDeNacimiento'].patchValue(this.formatDate(this.datosUsuario.dateOfBirth));
            this.formaUsuario.controls['ocupacion'].patchValue(this.datosUsuario.ocupation);
            this.formaUsuario.controls['cargo'].patchValue(this.datosUsuario.charge);
            this.formaUsuario.controls['genero'].patchValue(this.datosUsuario.gender);
            this.formaUsuario.controls['estadoCivil'].patchValue(this.datosUsuario.civilStatus);
            this.formaUsuario.controls['CURP'].patchValue(this.datosUsuario.curp);
            this.formaUsuario.controls['ClaveElector'].patchValue(this.datosUsuario.claveDeElector);
            this.formaUsuario.controls['ClaveINE'].patchValue(this.datosUsuario.numberINECredential);
            this.formaUsuario.controls['estado'].patchValue(this.datosUsuario.estado);
            this.formaUsuario.controls['municipio'].patchValue(this.datosUsuario.municipio);
            this.formaUsuario.controls['localidad'].patchValue(this.datosUsuario.localidad);
          }
          else
          {
            this.notifications.showError(res.mensajeError);
          }
        }
      );

    }
    private formatDate(date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    }
    public closeEstados(): void {
     this.esperawe = true;
      let interval = setInterval( () => {
        this.esperawe = false;
        clearInterval(interval);
        this.OnClickObtenerMunicipios();
      }, 500);
      
  }
  public closeMunicipuis(): void {
    this.esperawe = true;
    let interval = setInterval( () => {
      this.esperawe = false;
      clearInterval(interval);
      this.OnClickObtenerLocalidad();
    }, 500);
  }

    ngOnInit() {
      this.GetDatosUsuario();
        this.loadEstadoList();

        this.formaUsuario = new FormGroup({
            'nombreCompletoUsuario': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(1), Validators.maxLength(50)]),
            'estado': new FormControl(null, [Validators.required]),
            'municipio': new FormControl(null, [Validators.required]),
            'localidad': new FormControl(null, [Validators.required]),
            'direccion': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_ ]*$'), Validators.minLength(1), Validators.maxLength(50)]),
            'telefono': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(15)]),
            'celular': new FormControl(null, [Validators.required,  Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(15)]),
            'fechaDeNacimiento': new FormControl(null, [Validators.required]),
            'ocupacion': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(1), Validators.maxLength(50)]),
            'cargo': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z]+'), Validators.minLength(1), Validators.maxLength(50)]),
            'genero': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_ ]*$'), Validators.minLength(1), Validators.maxLength(50)]),
            'estadoCivil': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_ ]*$'), Validators.minLength(1), Validators.maxLength(50)]),
            'CURP': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_ ]*$'), Validators.minLength(1), Validators.maxLength(50)]),
            'ClaveElector': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_ ]*$'), Validators.minLength(1), Validators.maxLength(50)]),
            'ClaveINE': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_ ]*$'), Validators.minLength(1), Validators.maxLength(50)])
        })
    }
    loadEstadoList(){
        this.facadeService.GetEstados().subscribe(
          res => {
            if(!res.exitoso){
              this.notifications.showError(res.mensajeError);
              return;
            }
            const estados = res.payload as EstadoDTO[];
    
            this.lstEstado = estados;
    
            this.notifications.showSuccess('Se cargaron las listas');
          });
      }
      OnClickObtenerMunicipios(){
          if(!this.lstEstado.find(e => e.nombre === this.formaUsuario.value.estado))
          {
             this.notifications.showError("Seleccione un estado valido.");
            return;
          }
          let Estado = this.lstEstado.find(e => e.nombre === this.formaUsuario.value.estado);
          let idEstado: DTOidEstado = {
            id : Estado.id
          }
          this.facadeService.GetMunicipiosPorIdEstado(idEstado).subscribe(
            res => {
              if(!res.exitoso){
                this.notifications.showError(res.mensajeError);
                return;
              }
              const listaMunicipios = res.payload as MunicipioDTO[];
              this.lstMunicipios = listaMunicipios;
              this.notifications.showSuccess('Se cargaron los municipios');
            });
      }  
    onSubmitFormaUsuario(){
      if(!this.formaUsuario.valid){
        return;
      }
      let Localidad = this.lstLocalidad.find(e => e.nombre === this.formaUsuario.value.localidad);
     
      const valoresUsuario :DTODatosUsuario = 
      {
        id : this.authService.getUserId(),
        fullName : this.formaUsuario.value.nombreCompletoUsuario,
        address : this.formaUsuario.value.direccion,
        idLocalidad : Localidad.id,
        cellPhone : this.formaUsuario.value.celular,
        phoneNumber : this.formaUsuario.value.telefono,
        dateOfBirth : this.formaUsuario.value.fechaDeNacimiento,
        gender : this.formaUsuario.value.genero,
        civilStatus : this.formaUsuario.value.estadoCivil,
        ocupation : this.formaUsuario.value.ocupacion,
        charge : this.formaUsuario.value.cargo,
        curp : this.formaUsuario.value.CURP,
        claveDeElector: this.formaUsuario.value.ClaveElector,
        numberINECredential: this.formaUsuario.value.ClaveINE,
        role: "Usuario"
      }
      this.facadeService.PostUserData(valoresUsuario).subscribe(
        res => { 
          if(res.exitoso){
            this.notifications.showSuccess('Datos guardados correctamente.');
            this.formaUsuario.reset();
          }else{
            this.notifications.showError(res.mensajeError);
          }  
        }
      );
    }
}
