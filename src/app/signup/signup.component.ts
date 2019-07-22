import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FacadeService } from '../shared/services/facade.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistroUsuarioDTO } from '../shared/interfaces/DTO';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    formaSignUP: FormGroup;
    constructor(private facadeService: FacadeService, private routerService: Router) {}

    ngOnInit() {
        this.formaSignUP = new FormGroup({
            'usuario': new FormControl(null, [Validators.required]),
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$")]),
            'repeatPassword': new FormControl(null, [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$")])
        });
    }

    onSubmitRegister() {
        if(this.formaSignUP.controls.password.value !== this.formaSignUP.controls.repeatPassword.value ){
            return;
        }
        const valoresForma = this.formaSignUP.value as RegistroUsuarioDTO;
        this.facadeService.RegistroUsuario(valoresForma).subscribe(
            res => { if(!res.exitoso) {
                this.routerService.navigateByUrl('/login');
            }else{
                console.log(res.mensajeError);
            }
        }
        )
    }

}
