import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class NotificationService {

    constructor(private toastr: ToastrService) {

    }

    showSuccess(message: string) {
        this.toastr.success(message, 'Exitoso', {
            timeOut: 3000
          });
    }

    showError(message: string) {
        this.toastr.error(message, 'Ocurrió un error', {
            timeOut: 3000
          });
    }

    showInformation(message: string) {
        this.toastr.info(message, 'Información', {
            timeOut: 3000
          });
    }
} 