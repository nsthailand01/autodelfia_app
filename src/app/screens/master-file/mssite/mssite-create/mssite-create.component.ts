import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MSSiteDTO } from '@app/models/data-transfer-object';
import { MasterFileService } from '../../master-file.service';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { MSSiteModel } from '@app/models';
import { ToastrNotificationService } from '@app/services';
import { Guid } from 'guid-typescript';
import { ConfirmDialogService } from '@app/shared/dialogs/confirm-dialog/confirm-dialog.service';
import { Observable, of } from 'rxjs';
import { MssitePickerComponent } from '@app/pickers/mssite-picker/mssite-picker.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-mssite-create',
  templateUrl: './mssite-create.component.html',
  styleUrls: ['./mssite-create.component.scss']
})
export class MssiteCreateComponent extends BaseComponent implements OnInit, AfterViewInit {
  public msSiteForm: FormGroup;
  private msSiteDTO: MSSiteDTO;
  private isUpdated: boolean = false;
  public isActive: boolean = true;
  public isParent: boolean = false;
  imgLogoString: string | ArrayBuffer = null;
  imgPictureString: string | ArrayBuffer = null;
  imgLogoNotAvailable = './assets/img/image-not-available.png';
  imgPictureNotAvailable = './assets/img/image-not-available.png';

  imgReporterSignString: string | ArrayBuffer = null;
  imgGuarantorSignString: string | ArrayBuffer = null;
  imgReporterNotAvailable = './assets/img/image-not-available.png';
  imgGuarantorNotAvailable = './assets/img/image-not-available.png';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private router: Router,
    private masterFileService: MasterFileService,
    private notiService: ToastrNotificationService,
    public dom: DomSanitizer
  ) {
    super();
  }

  ngAfterViewInit(): void {
    const isActive = this.msSiteForm.get('isActiveFlag');
    const ob: Observable<boolean> = isActive.valueChanges;
    // tslint:disable-next-line: deprecation
    ob.subscribe((v: any) => {
      this.isActive = (v != '1' && v != null) ? false : true;
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isUpdated && this.msSiteForm.dirty) {
      return this.confirmDlgService.open();
    }

    return of(true);
  }

  ngOnInit(): void {
    this.createInitialForm();
    this.doLoadData();
  }

  createInitialForm() {
    const objModel: MSSiteModel = {} as MSSiteModel;
    this.msSiteForm = this.fb.group(new MSSiteModel());
    this.msSiteDTO = {
      MSSites: [new MSSiteModel()],
    };

    this.imgLogoString = null;
    this.imgPictureString = null;
    this.imgReporterSignString = null;
    this.imgGuarantorSignString = null;
  }

  async doLoadData() {
    const storageData = sessionStorage.getItem('MSSiteDataStorage');
    const objData = JSON.parse(storageData) as MSSiteModel;

    if (objData != null) {
      const item = {
        siteID: objData.siteID,
        sqlSelect: `it.*, parent.SiteName as ParentSiteName `,
        sqlFrom: `Left Outer Join MSSite As parent On (parent.SiteID = it.ParentSiteID)`,
        sqlWhere: `it.SiteID = '${objData.siteID}'`
      };
      await this.masterFileService.getSiteById(item)
        // tslint:disable-next-line: deprecation
        .subscribe((res) => {
          const model: MSSiteModel = Object.assign({}, res.data.MSSites[0]);
          this.patchItemValues(model);
          this.msSiteForm.patchValue({
            spParmLastSiteID: this.msSiteForm.get('siteID').value,
            isNew: false
          });

          let imgData = this.msSiteForm.get('logo').value;
          this.imgLogoString = imgData == '' ? null : imgData;
          imgData = this.msSiteForm.get('picture').value;
          this.imgPictureString = imgData == '' ? null : imgData;

          imgData = this.msSiteForm.get('reporterSignature').value;
          this.imgReporterSignString = imgData == '' ? null : imgData;
          imgData = this.msSiteForm.get('guarantorSignature').value;
          this.imgGuarantorSignString = imgData == '' ? null : imgData;

          const active = this.msSiteForm.get('isActiveFlag').value;
          this.isActive = (active != 1 && active != null) ? false : true;
          this.isParent = (this.msSiteForm.get('siteFlag').value == 'P') ? true : false;
        }, (err) => {
          console.log('err >> ', err);
          this.handleError(err);
        });
    }
  }

  public goBack = () => {
    sessionStorage.removeItem('MSSiteDataStorage');

    if (window.history.length > 1) {
      // this.location.back();
      this.router.navigate(['/master-file/mssite/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doSave = () => {
    this.executeCreation();
  }

  onPrepareSave() {
    let guId = Guid.create();
    if (this.msSiteForm.get('isNew').value) {
      //
    } else {
      guId = this.msSiteForm.get('siteID').value;
    }

    this.msSiteForm.patchValue({
      siteID: guId.toString(),
      latitude: parseFloat(this.msSiteForm.get('latitude').value),
      longtitude: parseFloat(this.msSiteForm.get('longtitude').value),
      isActiveFlag: this.isActive ? '1' : '0',
      logo: this.imgLogoString,
      picture: this.imgPictureString,

      reporterSignature: this.imgReporterSignString,
      guarantorSignature: this.imgGuarantorSignString,

      address: this.msSiteForm.get('address').value ? this.msSiteForm.get('address').value : null,
      moo: this.msSiteForm.get('moo').value ? this.msSiteForm.get('moo').value : null,
      roomNo: this.msSiteForm.get('roomNo').value ? this.msSiteForm.get('roomNo').value : null,
      floorNo: this.msSiteForm.get('floorNo').value ? this.msSiteForm.get('floorNo').value : null,

      building: this.msSiteForm.get('building').value ? this.msSiteForm.get('building').value : null,
      village: this.msSiteForm.get('village').value ? this.msSiteForm.get('village').value : null,
      street: this.msSiteForm.get('street').value ? this.msSiteForm.get('street').value : null,
      lane: this.msSiteForm.get('lane').value ? this.msSiteForm.get('lane').value : null,
      district: this.msSiteForm.get('district').value ? this.msSiteForm.get('district').value : null,
      amphur: this.msSiteForm.get('amphur').value ? this.msSiteForm.get('amphur').value : null,
      province: this.msSiteForm.get('province').value ? this.msSiteForm.get('province').value : null,
      postCode: this.msSiteForm.get('postCode').value ? this.msSiteForm.get('postCode').value : null,
    });

    this.msSiteDTO.MSSites = [Object.assign({}, this.msSiteForm.value)];
  }

  private executeCreation = () => {
    this.spinner.show();
    this.onPrepareSave();

    if (this.msSiteForm.get('isNew').value == true) {
      this.masterFileService.createSite(this.msSiteDTO)
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
      this.masterFileService.updateSite(this.msSiteDTO)
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

  patchItemValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.msSiteForm.controls[ngName]) {
          this.msSiteForm.controls[ngName].patchValue(value[name]);
        }
      });
    } catch (error) {
      console.log('error >> ', error);
      this.handleError(error);
    }
  }

  onSiteFlagChange(event, value) {
    this.isParent = (value == 'P');
  }

  openMSSitePicker() {
    const initialState = {
      list: [
        this.msSiteForm.get('siteID').value
      ],
      whereClause: `it.SiteFlag = 'P'`,
      title: 'Parent Site',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(MssitePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.msSiteForm.patchValue({
          parentSiteID: value.selectedItem['SiteID'],
          parentSiteName: value.selectedItem['SiteName'],
        });
      },
        (err: any) => {
          console.log(err);
        });

  }

  logoFileChange(e: any) {
    const file = e.srcElement.files[0];
    if (!file) {
      return;
    }

    this.imgLogoNotAvailable = window.URL.createObjectURL(file);
    this.handleLogoFileInput(e.srcElement.files);
  }

  handleLogoFileInput(files: FileList) {
    const file = files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgLogoString = reader.result;
      // const output: any = document.getElementById('imgLogoString');
      // output.src = this.imgLogoString;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  pictureFileChange(e: any) {
    const file = e.srcElement.files[0];
    if (!file) {
      return;
    }

    this.imgPictureNotAvailable = window.URL.createObjectURL(file);
    this.handlePictureFileInput(e.srcElement.files);
  }

  handlePictureFileInput(files: FileList) {
    const file = files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgPictureString = reader.result;
      // const output: any = document.getElementById('imgPictureString');
      // output.src = this.imgPictureString;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  reporterSignFileChange(e: any) {
    const file = e.srcElement.files[0];
    if (!file) {
      return;
    }

    this.imgReporterNotAvailable = window.URL.createObjectURL(file);
    this.handleReporterSignFileInput(e.srcElement.files);
  }

  handleReporterSignFileInput(files: FileList) {
    const file = files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgReporterSignString = reader.result;
      // const output: any = document.getElementById('imgReporterSignString');
      // console.log('elementbyid : ', output);
      // output.src = this.imgReporterSignString;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  guarantorSignFileChange(e: any) {
    const file = e.srcElement.files[0];
    if (!file) {
      return;
    }

    this.imgGuarantorNotAvailable = window.URL.createObjectURL(file);
    this.handleGuarantorSignFileInput(e.srcElement.files);
  }

  handleGuarantorSignFileInput(files: FileList) {
    const file = files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgGuarantorSignString = reader.result;
      // const output: any = document.getElementById('imgGuarantorSignString');
      // output.src = this.imgGuarantorSignString;
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  removeImg = (type: string) => {
    if (type == 'logo') {
      this.imgLogoString = null;
      this.imgLogoNotAvailable = '../../../../../assets/img/image-not-available.png';
    } else if (type == 'picture') {
      this.imgPictureString = null;
      this.imgPictureNotAvailable = '../../../../../assets/img/image-not-available.png';
    } else if (type == 'reporterSign') {
      this.imgReporterSignString = null;
      this.imgReporterNotAvailable = '../../../../../assets/img/image-not-available.png';
    } else if (type == 'guarantorSign') {
      this.imgGuarantorSignString = null;
      this.imgGuarantorNotAvailable = '../../../../../assets/img/image-not-available.png';
    }
  }

}
