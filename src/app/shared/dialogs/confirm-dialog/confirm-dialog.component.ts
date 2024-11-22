import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      // this.message = data.message || this.message;
      // if (data.buttonText) {
      //  this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
      //  this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      // }
      // else {
      //  this.confirmButtonText = data.confirmText;
      //  this.cancelButtonText = data.cancelText;
      // }
      
    }
  }

  ngOnInit() {
    // this.modalTitle = this.data?.title;
    // this.message = this.data?.message;

    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.onDismiss();
      }
    });

    // this.dialogRef.backdropClick().subscribe(() => {
    //  this.onDismiss();
    // });
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  onCancel() {

  }

}

export class ConfirmDialogModel {
  constructor(public title: string, public message: string) {
  }
}
