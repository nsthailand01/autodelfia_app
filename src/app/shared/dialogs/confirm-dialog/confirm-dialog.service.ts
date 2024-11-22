import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  dialogRef: MatDialogRef<ConfirmDialogComponent>;

  public open(options: any = null): Observable<any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '200px';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.data = {
      title: options?.title ?? `คุณยังทำรายการไม่เสร็จ คุณต้องการออกโดยไม่ทำรายการต่อใช่ไหม?`,
      message: options?.message ?? 'Are you sure you want to do this?',
      cancelText: options?.cancelText ?? 'CANCEL',
      confirmText: options?.confirmText ?? 'YES'
    };

    this.dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    return this.dialogRef.afterClosed();
  }

}
