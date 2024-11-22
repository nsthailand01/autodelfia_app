import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MSSiteGroupDTO } from '@app/models/data-transfer-object';
import { Router } from '@angular/router';
import { MasterFileService } from '../../master-file.service';
import { ToastrNotificationService } from '@app/services';
import { MSSiteGroupModel } from '@app/models';
import { Guid } from 'guid-typescript';
import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-mssite-group-create',
  templateUrl: './mssite-group-create.component.html',
  styleUrls: ['./mssite-group-create.component.scss']
})
export class MssiteGroupCreateComponent extends BaseComponent implements OnInit {
  public msSiteGroupForm: FormGroup;
  private msSiteGroupDTO: MSSiteGroupDTO;
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
    if (!this.isUpdated && this.msSiteGroupForm.dirty) {
      return this.confirmDlgService.open();
    }

    return of(true);
  }

  ngOnInit(): void {
    this.createInitialForm();
    this.doLoadData();
  }

  createInitialForm() {
    const objModel: MSSiteGroupModel = {} as MSSiteGroupModel;

    this.msSiteGroupForm = this.fb.group({
      siteGroupID: [''],
      spParmLastSiteGroupID: [''],
      siteGroupCode: [''],
      siteGroupName: [''],
      siteGroupNameEng: [''],
      remark: [''],
      isNew: [true],
    });

    this.msSiteGroupDTO = {
      MSSiteGroups: [new MSSiteGroupModel()],
    };
  }

  doLoadData() {
    const storageData = sessionStorage.getItem('MSSiteGroupDataStorage');
    const objData = JSON.parse(storageData) as MSSiteGroupModel;

    if (objData != null) {
      this.masterFileService.getSiteGroupById({ SiteGroupID: objData.siteGroupID })
        .subscribe((res) => {
          const model: MSSiteGroupModel = Object.assign({}, res.data.MSSiteGroups[0]);
          this.patchItemValues(model);
          this.msSiteGroupForm.patchValue({
            spParmLastSiteGroupID: this.msSiteGroupForm.get('siteGroupID').value,
            isNew: false
          });
        }, (err) => {
          console.log('err >> ', err);
        });
    }
  }

  public goBack = () => {
    sessionStorage.removeItem('MSSiteGroupDataStorage');

    if (window.history.length > 1) {
      this.router.navigate(['/master-file/mssite-group/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doSave = () => {
    this.executeCreation(null);
  }

  onPrepareValueChange() {
    this.msSiteGroupForm.patchValue({
      siteGroupID: Guid.create().toString(),
    });

    this.msSiteGroupDTO.MSSiteGroups = [Object.assign({}, this.msSiteGroupForm.value)];
  }

  private executeCreation = (formValue: any) => {
    this.spinner.show();
    this.onPrepareValueChange();

    if (this.msSiteGroupForm.get('isNew').value == true) {
      this.masterFileService.createSiteGroup(this.msSiteGroupDTO)
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
      this.masterFileService.updateSiteGroup(this.msSiteGroupDTO)
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
        if (this.msSiteGroupForm.controls[ngName]) {
          this.msSiteGroupForm.controls[ngName].patchValue(value[name]);
        }
      });
      console.log('after patch value >> ', this.msSiteGroupForm.value);
    } catch (error) {
      console.log('error >> ', error);
    }
  }

}
