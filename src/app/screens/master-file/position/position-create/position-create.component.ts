import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MSPositionDTO } from '@app/models/data-transfer-object';
import { Router } from '@angular/router';
import { MasterFileService } from '../../master-file.service';
import { ToastrNotificationService } from '@app/services';
import { MSPositionModel } from '@app/models';
import { Guid } from 'guid-typescript';
import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-position-create',
  templateUrl: './position-create.component.html',
  styleUrls: ['./position-create.component.scss']
})
export class PositionCreateComponent extends BaseComponent implements OnInit {
  public msPositionForm: FormGroup;
  private msPositionDTO: MSPositionDTO;
  private isUpdated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private masterFileService: MasterFileService,
    private notiService: ToastrNotificationService
  ) {
    super();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isUpdated && this.msPositionForm.dirty) {
      return this.confirmDlgService.open();
    }
    return of(true);
  }

  ngOnInit(): void {
    this.createInitialForm();
    this.doLoadData();
  }

  createInitialForm() {
    this.msPositionForm = this.fb.group(new MSPositionModel());

    this.msPositionDTO = {
      MSPositions: [new MSPositionModel()],
    };
  }

  doLoadData() {
    const storageData = sessionStorage.getItem('MSPositionDataStorage');
    const objData = JSON.parse(storageData) as MSPositionModel;

    if (objData != null) {
      const item = {
        sqlWhere: `it.PositionID = '${objData.positionID}'`
      };

      this.masterFileService.getPositionById(item)
        // tslint:disable-next-line: deprecation
        .subscribe((res) => {
          const model: MSPositionModel = Object.assign({}, res.data.MSPositions[0]);
          this.patchItemValues(model);
          this.msPositionForm.patchValue({
            spParmLastPositionID: this.msPositionForm.get('positionID').value,
            isNew: false
          });
        }, (err) => {
          console.log('err >> ', err);
        });
    }
  }

  public goBack = () => {
    sessionStorage.removeItem('MSPositionDataStorage');

    if (window.history.length > 1) {
      this.router.navigate(['/master-file/position/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doSave = () => {
    this.executeCreation(null);
  }

  onPrepareValueChange() {
    this.msPositionForm.patchValue({
      positionID: Guid.create().toString(),
    });

    this.msPositionDTO.MSPositions = [Object.assign({}, this.msPositionForm.value)];
  }

  private executeCreation = (formValue: any) => {
    this.spinner.show();
    this.onPrepareValueChange();

    if (this.msPositionForm.get('isNew').value == true) {
      this.masterFileService.createPosition(this.msPositionDTO)
        // tslint:disable-next-line: deprecation
        .subscribe((res) => {
          this.isUpdated = true;
          this.spinner.hide();
          this.notiService.showSuccess('Create Successfully.');
          this.goBack();
        }, (err) => {
          this.spinner.hide();
          console.log('error >> ', err);
          const msg = err.error?.errors?.message ?? err.message ?? err.error?.message;
          this.notiService.showError(msg);
        });
    } else {
      this.masterFileService.updatePosition(this.msPositionDTO)
        // tslint:disable-next-line: deprecation
        .subscribe((res) => {
          this.isUpdated = true;
          this.spinner.hide();
          this.notiService.showSuccess('Update Successfully.');
          this.goBack();
        }, (err) => {
          this.spinner.hide();
          console.log('error >> ', err);
          const msg = err.error?.errors?.message ?? err.message ?? err.error?.message;
          this.notiService.showError(msg);
        });
    }
  }

  patchItemValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.msPositionForm.controls[ngName]) {
          this.msPositionForm.controls[ngName].patchValue(value[name]);
        }
      });
    } catch (error) {
      console.log('error >> ', error);
    }
  }

}
