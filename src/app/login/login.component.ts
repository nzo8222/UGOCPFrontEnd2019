import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FacadeService } from '../shared/services/facade.service';
import { LoginDTO } from '../shared/interfaces/DTO';
import { AuthService } from '../shared/guard/auth.service';
import { NotificationService } from '../shared/services/notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    FormaLogIn: FormGroup;
    constructor(
        private facadeService: FacadeService,
        public router: Router,
        private authService: AuthService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.FormaLogIn = new FormGroup({
            'usuario': new FormControl(null, [Validators.required]),
            'password': new FormControl(null, [Validators.required])
        })
    }
    onLoggedin() {
        // Si no es valido regresa.
        if (!this.FormaLogIn.valid) { return; } else {
            const login = this.FormaLogIn.value as LoginDTO;

            this.facadeService.Login(login).subscribe(
                res => {
                    if (!res.exitoso) {
                        this.notificationService.showError(res.mensajeError);
                        return;
                    }
                    this.authService.setSession(res.payload);

                    // localStorage.setItem('isLoggedin', 'true');

                    this.router.navigateByUrl('/dashboard');
                }
            );
        }
    }
}
