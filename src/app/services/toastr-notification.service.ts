import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrNotificationService {

  constructor(
    private toastr: ToastrService
  ) { }

  showSuccess(message: string, title: string = 'Notification') {
    this.toastr.success(message, title);
  }

  showError(message: string, title: string = 'Notification') {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title: string = 'Notification') {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title: string = 'Notification') {
    this.toastr.warning(message, title);
  }
}
