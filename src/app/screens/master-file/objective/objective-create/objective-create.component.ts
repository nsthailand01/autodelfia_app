import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrNotificationService } from '@app/services';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MSLabProfileModel } from '@app/models';
import { LabProfileDTO } from '@app/models/data-transfer-object';
import { DomSanitizer } from '@angular/platform-browser';
import { MasterFileService } from '../../master-file.service';
import { Guid } from 'guid-typescript';
import { Observable, of } from 'rxjs';
import { IpServiceService } from '@app/services/ip-service.service';
// import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-objective-create',
  templateUrl: './objective-create.component.html',
  styleUrls: ['./objective-create.component.scss']
})
export class ObjectiveCreateComponent extends BaseComponent implements OnInit {

  public labProfileForm: FormGroup;
  private labProfileDTO: LabProfileDTO;
  private isUpdated: boolean = false;
  bsConfig: Partial<BsDatepickerConfig>;
  imgsrc = '../../../../../assets/img/no_image_available.svg';
  imageBaseData: string | ArrayBuffer = null;
  isDefault: boolean = false;

  constructor(
    private fb: FormBuilder,
    // private location: Location,
    private router: Router,
    private notiService: ToastrNotificationService,
    public dom: DomSanitizer,
    private masterFileService: MasterFileService,
    private ip: IpServiceService,
  ) {
    super();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isUpdated && this.labProfileForm.dirty) {
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
    const objModel: MSLabProfileModel = {} as MSLabProfileModel;
    this.labProfileForm = this.fb.group(new MSLabProfileModel());

    this.labProfileDTO = {
      MSLabProfiles: [new MSLabProfileModel()],
    };

    this.imageBaseData = null;
  }

  doLoadData() {
    const storageData = sessionStorage.getItem('MSLabProfileDataStorage');
    const objData = JSON.parse(storageData) as MSLabProfileModel;

    if (objData != null) {
      const item = {
        sqlSelect: `it.*`,
        sqlWhere: `it.profileID = '${objData.profileID}'`
      };

      this.masterFileService.getLabProfileById(item)
        .subscribe((res) => {
          const model: MSLabProfileModel = Object.assign({}, res.data.MSLabProfiles[0]);
          this.patchItemValues(model);
          this.labProfileForm.patchValue({
            spParmLastProfileID: this.labProfileForm.get('profileID').value,
            isNew: false
          });

          // const imgData = this.labProfileForm.get('picture').value;
          // this.imageBaseData = imgData == '' ? null : imgData;

          this.isDefault = this.labProfileForm.get('isDefault').value;

          console.log('loaded :: ', this.labProfileForm);

        }, (err) => {
          console.log('err >> ', err);
        });
    }
  }

  public goBack = () => {
    sessionStorage.removeItem('MSLabProfileDataStorage');

    if (window.history.length > 1) {
      // this.location.back()
      this.router.navigate(['/master-file/objective/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doSave = () => {
    this.executeCreation(null);
  }

  onPrepareValueChange() {
    let guId = Guid.create();
    if (this.labProfileForm.get('isNew').value) {
      //
    } else {
      guId = this.labProfileForm.get('profileID').value;
    }

    this.labProfileForm.patchValue({
      profileID: guId.toString(),
    });

    this.labProfileDTO.MSLabProfiles = [Object.assign({}, this.labProfileForm.value)];
  }

  private executeCreation = (formValue: any) => {
    this.spinner.show();
    this.onPrepareValueChange();

    if (this.labProfileForm.get('isNew').value == true) {
      this.masterFileService.createLabProfile(this.labProfileDTO)
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

    this.masterFileService.updateLabProfile(this.labProfileDTO)
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
        if (this.labProfileForm.controls[ngName]) {
          this.labProfileForm.controls[ngName].patchValue(value[name]);
        }
      });
      console.log('after patch value >> ', this.labProfileForm.value);
    } catch (error) {
      console.log('error >> ', error);
    }
  }

  onDefaultCheckedChange(event) {
    console.log('default > ', event.checked);
    this.labProfileForm.get('isDefault').patchValue(event.checked);

    console.log('form >> ', this.labProfileForm);
  }

}
