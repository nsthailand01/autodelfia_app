import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrNotificationService } from '@app/services';
import { MasterFileService } from '../../master-file.service';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { DepartmentDTO } from '@app/models/data-transfer-object';
import { MSDepartmentModel } from '@app/models';
import { Guid } from 'guid-typescript';
import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.scss']
})

export class DepartmentCreateComponent extends BaseComponent implements OnInit {
  public departmentForm: FormGroup;
  private departmentDTO: DepartmentDTO;
  private isUpdated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private notiService: ToastrNotificationService,
    private masterFileService: MasterFileService
  ) {
    super();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isUpdated && this.departmentForm.dirty) {
      return this.confirmDlgService.open();
    }

    return of(true);
  }

  ngOnInit(): void {
    this.createInitialForm();
    this.doLoadData();
  }

  createInitialForm() {
    const objModel: MSDepartmentModel = {} as MSDepartmentModel;

    this.departmentForm = this.fb.group({
      deptID: [''],
      spParmLastDeptID: [''],
      deptCode: [''],
      deptName: [''],
      deptNameEng: [''],
      siteID: [''],
      createdBy: [''],
      createdDate: [new Date()],
      modifiedBy: [''],
      isDeleted: [0],
      modifiedDate: [new Date()],
      remark: [''],
      isNew: [true],
    });

    this.departmentDTO = {
      MSDepartments: [new MSDepartmentModel()],
    };
  }

  doLoadData() {
    const storageData = sessionStorage.getItem('MSDepartmentDataStorage');
    const objData = JSON.parse(storageData) as MSDepartmentModel;

    if (objData != null) {
      this.masterFileService.getDepartmentById({ DeptID: objData.deptID })
        .subscribe((res) => {
          const model: MSDepartmentModel = Object.assign({}, res.data.MSDepartments[0]);
          this.patchItemValues(model);
          this.departmentForm.patchValue({
            spParmLastDeptID: this.departmentForm.get('deptID').value,
            isNew: false
          });
        }, (err) => {
          console.log('err >> ', err);
        });
    }
  }

  public goBack = () => {
    sessionStorage.removeItem('MSDepartmentDataStorage');

    if (window.history.length > 1) {
      // this.location.back()
      this.router.navigate(['/master-file/department/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doSave = () => {
    this.executeCreation(null);
  }

  onPrepareValueChange() {
    this.departmentForm.patchValue({
      deptID: Guid.create().toString()
    });

    this.departmentDTO.MSDepartments = [Object.assign({}, this.departmentForm.value)];
  }

  private executeCreation = (formValue: any) => {
    this.spinner.show();
    this.onPrepareValueChange();

    if (this.departmentForm.get('isNew').value == true) {
      this.masterFileService.createDepartment(this.departmentDTO)
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

      return;
    }

    this.masterFileService.updateDepartment(this.departmentDTO)
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

  patchItemValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    console.log('data to patch value -->> ', value);
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.departmentForm.controls[ngName]) {
          this.departmentForm.controls[ngName].patchValue(value[name]);
        }
      });
      console.log('after patch value >> ', this.departmentForm.value);
    } catch (error) {
      console.log('error >> ', error);
    }
  }

}
