import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrNotificationService } from '@app/services';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MSLabSampleTypeModel } from '@app/models';
import { SampleTypeDTO } from '@app/models/data-transfer-object';
import { DomSanitizer } from '@angular/platform-browser';
import { MasterFileService } from '../../master-file.service';
import { Guid } from 'guid-typescript';
import { Observable, of } from 'rxjs';
import { IpServiceService } from '@app/services/ip-service.service';
import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';
import { MslabProfilePickerComponent } from '@app/pickers';

@Component({
  selector: 'app-sample-type-create',
  templateUrl: './sample-type-create.component.html',
  styleUrls: ['./sample-type-create.component.scss']
})
export class SampleTypeCreateComponent extends BaseComponent implements OnInit {
  public sampleTypeForm: FormGroup;
  private sampleTypeDTO: SampleTypeDTO;
  private isUpdated: boolean = false;
  bsConfig: Partial<BsDatepickerConfig>;
  imgsrc = '../../../../../assets/img/no_image_available.svg';
  imageBaseData: string | ArrayBuffer = null;
  isDefault: boolean = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private notiService: ToastrNotificationService,
    public dom: DomSanitizer,
    private masterFileService: MasterFileService,
    private ip: IpServiceService,
  ) {
    super();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isUpdated && this.sampleTypeForm.dirty) {
      return this.confirmDlgService.open();
    }

    return of(true);
  }

  ngOnInit(): void {
    this.bsConfig = Object.assign({}, {
      dateInputFormat: 'DD/MM/YYYY'
    });

    this.createInitialForm();
    this.doLoadData();

    this.ip.getIPAddress().subscribe((res: any) => {
      console.log('ip address >> ', res.ip);
    });
  }

  createInitialForm() {
    const objModel: MSLabSampleTypeModel = {} as MSLabSampleTypeModel;
    this.sampleTypeForm = this.fb.group(new MSLabSampleTypeModel());

    this.sampleTypeDTO = {
      MSLabSampleTypes: [new MSLabSampleTypeModel()],
    };

    this.imageBaseData = null;
  }

  doLoadData() {
    const storageData = sessionStorage.getItem('MSLabSampleTypeDataStorage');
    const objData = JSON.parse(storageData) as MSLabSampleTypeModel;

    if (objData != null) {
      const sample = {
        sqlSelect: `it.*, MSLabProfile.ProfileName`,
        sqlFrom: `Left Outer Join MSLabProfile On (it.ProfileID = MSLabProfile.ProfileID)`,
        sqlWhere: `it.SampleTypeID = '${objData.sampleTypeID}'`
      };

      this.masterFileService.getSampleTypeById(sample)
        .subscribe((res) => {
          const model: MSLabSampleTypeModel = Object.assign({}, res.data.MSLabSampleTypes[0]);
          this.patchItemValues(model);
          this.sampleTypeForm.patchValue({
            spParmLastSampleTypeID: this.sampleTypeForm.get('sampleTypeID').value,
            isNew: false
          });

          const imgData = this.sampleTypeForm.get('picture').value;
          this.imageBaseData = imgData == '' ? null : imgData;

          this.isDefault = this.sampleTypeForm.get('isDefault').value;

        }, (err) => {
          console.log('err >> ', err);
        });
    }
  }

  public goBack = () => {
    sessionStorage.removeItem('MSLabSampleTypeDataStorage');

    if (window.history.length > 1) {
      // this.location.back()
      this.router.navigate(['/master-file/sample-type/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doSave = () => {
    this.executeCreation(null);
  }

  onPrepareValueChange() {
    let guId = Guid.create();
    if (this.sampleTypeForm.get('isNew').value) {
      //
    } else {
      guId = this.sampleTypeForm.get('sampleTypeID').value;
    }

    this.sampleTypeForm.patchValue({
      sampleTypeID: guId.toString(),
      picture: this.imageBaseData,
    });

    this.sampleTypeDTO.MSLabSampleTypes = [Object.assign({}, this.sampleTypeForm.value)];
  }

  private executeCreation = (formValue: any) => {
    this.spinner.show();
    this.onPrepareValueChange();

    if (this.sampleTypeForm.get('isNew').value == true) {
      this.masterFileService.createSampleType(this.sampleTypeDTO)
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

    this.masterFileService.updateSampleType(this.sampleTypeDTO)
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

  fileChange(e) {
    const file = e.srcElement.files[0];
    if (!file) {
      return;
    }

    this.imgsrc = window.URL.createObjectURL(file);
    this.handleFileInput(e.srcElement.files);
  }

  handleFileInput(files: FileList) {
    const file = files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageBaseData = reader.result;
      const output: any = document.getElementById('imgSignature');
      output.src = this.imageBaseData;

    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  patchItemValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    console.log('data to patch value -->> ', value);
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.sampleTypeForm.controls[ngName]) {
          this.sampleTypeForm.controls[ngName].patchValue(value[name]);
        }
      });
      console.log('after patch value >> ', this.sampleTypeForm.value);
    } catch (error) {
      console.log('error >> ', error);
    }
  }

  onDefaultCheckedChange(event) {
    console.log('default > ', event.checked);
    this.sampleTypeForm.get('isDefault').patchValue(event.checked);

    console.log('form >> ', this.sampleTypeForm);
  }

  openProfilePicker() {
    const initialState = {
      list: [
        // this.sampleTypeForm.get('requestID').value
        'xxx'
      ],
      title: 'Profile',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(MslabProfilePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.sampleTypeForm.patchValue({
          profileID: value.selectedItem['ProfileID'],
          profileName: value.selectedItem['ProfileName']
        });
      },
        (err: any) => {
          console.log(err);
        });
  }

}
