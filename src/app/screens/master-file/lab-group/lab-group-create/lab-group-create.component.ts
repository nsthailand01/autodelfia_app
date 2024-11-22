import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MSLabGroupDTO } from '@app/models/data-transfer-object';
import { Router } from '@angular/router';
import { MasterFileService } from '../../master-file.service';
import { ToastrNotificationService } from '@app/services';
import { MSLabGroupModel } from '@app/models';
import { Guid } from 'guid-typescript';
import { Observable, of } from 'rxjs';
import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-lab-group-create',
  templateUrl: './lab-group-create.component.html',
  styleUrls: ['./lab-group-create.component.scss']
})
export class LabGroupCreateComponent extends BaseComponent implements OnInit {

  public msLabGroupForm: FormGroup;
  private msLabGroupDTO: MSLabGroupDTO;
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
    if (!this.isUpdated && this.msLabGroupForm.dirty) {
      return this.confirmDlgService.open();
    }
    return of(true);
  }

  ngOnInit(): void {
    this.createInitialForm();
    this.doLoadData();
  }

  createInitialForm() {
    const objModel: MSLabGroupModel = {} as MSLabGroupModel;

    this.msLabGroupForm = this.fb.group({
      labGroupID: [''],
      spParmLastLabGroupID: [''],
      labGroupCode: [''],
      labGroupName: [''],
      labGroupNameEng: [''],
      satatus: [''],
      createdBy: [''],
      createdDate: [new Date()],
      modifiedBy: [''],
      isDeleted: [0],
      modifiedDate: [new Date()],
      siteID: [''],
      picture: [''],
      remark: [''],
      isNew: [true],
    });

    this.msLabGroupDTO = {
      MSLabGroups: [new MSLabGroupModel()],
    };
  }

  doLoadData() {
    const storageData = sessionStorage.getItem('MSLabGroupDataStorage');
    const objData = JSON.parse(storageData) as MSLabGroupModel;

    if (objData != null) {
      this.masterFileService.getLabGroupById({ LabGroupID: objData.labGroupID })
        .subscribe((res) => {
          const model: MSLabGroupModel = Object.assign({}, res.data.MSLabGroups[0]);
          this.patchItemValues(model);
          this.msLabGroupForm.patchValue({
            spParmLastLabGroupID: this.msLabGroupForm.get('labGroupID').value,
            isNew: false
          });
        }, (err) => {
          console.log('err >> ', err);
        });
    }
  }

  public goBack = () => {
    sessionStorage.removeItem('MSLabGroupDataStorage');

    if (window.history.length > 1) {
      this.router.navigate(['/master-file/lab-group/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doSave = () => {
    this.executeCreation(null);
  }

  onPrepareValueChange() {
    this.msLabGroupForm.patchValue({
      labGroupID: Guid.create().toString(),
    });

    this.msLabGroupDTO.MSLabGroups = [Object.assign({}, this.msLabGroupForm.value)];
  }

  private executeCreation = (formValue: any) => {
    this.spinner.show();
    this.onPrepareValueChange();

    if (this.msLabGroupForm.get('isNew').value == true) {
      this.masterFileService.createLabGroup(this.msLabGroupDTO)
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
      this.masterFileService.updateLabGroup(this.msLabGroupDTO)
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
    console.log('data to patch value -->> ', value);
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.msLabGroupForm.controls[ngName]) {
          this.msLabGroupForm.controls[ngName].patchValue(value[name]);
        }
      });
      console.log('after patch value >> ', this.msLabGroupForm.value);
    } catch (error) {
      console.log('error >> ', error);
    }
  }

}
