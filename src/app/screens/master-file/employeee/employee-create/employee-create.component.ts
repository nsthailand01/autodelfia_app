import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { RaceModel } from '@app/models/race.model';
import { RequestsRepoService } from '@app/screens/request-sample/requests-repo.service';
import { ToastrNotificationService, UtilitiesService } from '@app/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MSEmployeeDTO, MSEmployeeModel } from '@app/models';
import { MasterFileService } from '../../master-file.service';
import { Guid } from 'guid-typescript';
import { Router } from '@angular/router';
import { PositionPickComponent } from '@app/pickers';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.scss']
})
export class EmployeeCreateComponent extends BaseComponent implements OnInit {
  public races: Array<RaceModel>;
  public employeeForm: FormGroup;
  public employeeDto: MSEmployeeDTO;

  private isUpdated: boolean = false;

  constructor(
    private fb: FormBuilder,
    private utilService: UtilitiesService,
    private requestsRepoService: RequestsRepoService,
    private masterFileService: MasterFileService,
    private notiService: ToastrNotificationService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.doLoadData();
    this.createInitialForm();
  }

  createInitialForm() {
    this.employeeForm = this.fb.group(new MSEmployeeModel());
    this.employeeDto = {
      MSEmployees: [new MSEmployeeModel()],
    };
  }

  public doLoadData = async () => {
    this.requestsRepoService.getRaceByCondition({})
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        const data = this.utilService.camelizeKeys(res.data.Races);
        this.races = data;
      }, (err) => {
        this.handleError(err);
      });

    const storageData = sessionStorage.getItem('MSEmployeeDataStorage');
    const objData = JSON.parse(storageData) as MSEmployeeModel;
    if (objData != null) {
      const item = {
        employeeID: objData.employeeID,
        sqlSelect: `it.*, pos.PositionCode, pos.PositionName`,
        sqlFrom: `Left Outer Join MSPosition pos On (pos.PositionID = it.PositionID)`,
        sqlWhere: `(it.EmployeeID = '${objData?.employeeID}')`,
        pageIndex: -1
      };

      this.masterFileService.getEmployeeById(item)
        // tslint:disable-next-line: deprecation
        .subscribe((res) => {
          const model: MSEmployeeModel = Object.assign({}, res.data.MSEmployees[0]);
          this.patchItemValues(model);
          this.employeeForm.patchValue({
            spParmLastEmployeeID: this.employeeForm.get('employeeID').value,
            isNew: false
          });
        }, (err) => {
          console.log('err >> ', err);
          this.handleError(err);
        });
    }
  }

  public goBack = () => {
    sessionStorage.removeItem('MSEmployeeDataStorage');

    if (window.history.length > 1) {
      this.router.navigate(['/master-file/employee/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  patchItemValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.employeeForm.controls[ngName]) {
          this.employeeForm.controls[ngName].patchValue(value[name]);
        }
      });
    } catch (error) {
      console.log('error >> ', error);
      this.handleError(error);
    }
  }

  public doSave = () => {
    this.executeCreation();
  }

  onPrepareSave() {
    let guId = Guid.create();
    if (this.employeeForm.get('isNew').value) {
      //
    } else {
      guId = this.employeeForm.get('employeeID').value;
    }

    this.employeeForm.patchValue({
      employeeID: guId.toString()
    });

    this.employeeDto.MSEmployees = [Object.assign({}, this.employeeForm.value)];
  }

  private executeCreation = () => {
    this.spinner.show();
    this.onPrepareSave();

    if (this.employeeForm.get('isNew').value == true) {
      this.masterFileService.createEmployee(this.employeeDto)
        // tslint:disable-next-line: deprecation
        .subscribe((res) => {
          this.isUpdated = true;
          this.spinner.hide();
          this.notiService.showSuccess('Create Successfully.');
          this.goBack();
        }, (err) => {
          this.spinner.hide();
          console.log('error >> ', err);
          this.handleError(err);
        });
    } else {
      this.masterFileService.updateEmployee(this.employeeDto)
        // tslint:disable-next-line: deprecation
        .subscribe((res) => {
          this.isUpdated = true;
          this.spinner.hide();
          this.notiService.showSuccess('Update Successfully.');
          this.goBack();
        }, (err) => {
          this.spinner.hide();
          console.log('error >> ', err);
          this.handleError(err);
        });
    }

  }

  onPositionPick = () => {
    const initialState = {
      list: [this.employeeForm.get('employeeID').value],
      title: 'ตำแหน่ง',
      class: 'my-class',
    };

    this.bsModalRef = this.bsModalService.show(PositionPickComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
    });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action.subscribe(
      (value: any) => {
        if (!value || value.isCancel) {
          return;
        }
        this.employeeForm.patchValue({
          positionID: value.selectedItem['PositionID'],
          positionCode: value.selectedItem['PositionCode'],
          positionName: value.selectedItem['PositionName'],
        });
      },
      (err: any) => {
        console.log(err);
        this.handleError(err);
      }
    );
  }

}
