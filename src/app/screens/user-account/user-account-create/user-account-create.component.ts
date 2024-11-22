import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, LOCALE_ID, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RepositoryService } from '@app/shared/repository.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ErrorHandlerService } from '@app/shared/error-handler.service';
import { Location } from '@angular/common';
import { SuccessDialogComponent } from '@app/shared/dialogs/success-dialog/success-dialog.component';
import { SecurityUsersDTO, Security_UsersModel } from '@app/models';
import { GuidServices } from '@app/services/guid.services';
import { MustMatch } from '@app/helpers/must-match.validator';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import Swal from 'sweetalert2';
import { UserAccountService } from '../user-account.service';
import { Guid } from 'guid-typescript';
import { Router } from '@angular/router';
import { AuthenticationService, ToastrNotificationService } from '@app/services';
import { DateAdapter } from '@angular/material/core';
import { MssitePickerComponent } from '@app/pickers/mssite-picker/mssite-picker.component';
import { EmployeePickerComponent } from '@app/pickers/employee-picker/employee-picker.component';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-account-create',
  templateUrl: './user-account-create.component.html',
  styleUrls: ['./user-account-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAccountCreateComponent extends BaseComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line: no-output-on-prefix
  @Output() public onUploadFinished = new EventEmitter<any>();
  public progress: number;
  public message: string;
  imageBaseData: string | ArrayBuffer = null;

  public registerForm: FormGroup;
  public securityUsersDto: SecurityUsersDTO;
  private dialogConfig: any;
  public submitted = false;
  private isUpdated: boolean = false;
  hide = true;
  imgsrc = './assets/img/image-not-available.png';

  public userInfo = {
    forDepartureHospital: false,
    forScienceCenter: false
  };

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    // private location: Location,
    private repository: RepositoryService,
    private dialog: MatDialog,
    private errorService: ErrorHandlerService,
    private fb: FormBuilder,
    private userService: UserAccountService,
    private notiService: ToastrNotificationService,
    private dateAdapter: DateAdapter<Date>,
    private cdr: ChangeDetectorRef,
    public dom: DomSanitizer,
    private http: HttpClient
  ) {
    super();

    this.dateAdapter.setLocale('th-TH');

    // tslint:disable-next-line: deprecation
    this.authService.currentUser.subscribe((user: any) => {
      this.userInfo.forDepartureHospital = user?.data?.SecurityUsers?.ForDepartureHospital;
      this.userInfo.forScienceCenter = user?.data?.SecurityUsers?.ForScienceCenter;
    });

    // console.log('this.userInfo >> ', this.userInfo);
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: {}
    };

    this.createInitialForm();
    this.doLoadData();
  }

  createInitialForm() {
    const validators = [Validators.required];
    // this.registerForm = this.fb.group(
    //   new Security_UsersModel(), {
    //   validator: MustMatch('userPassword', 'confirmPassword')
    // });
    this.registerForm = this.fb.group(new Security_UsersModel());
    this.registerForm.setValidators(f => MustMatch('userPassword', 'confirmPassword'));

    this.registerForm.get('userName').setValidators([...validators, Validators.maxLength(25)]);
    this.registerForm.get('userPassword').setValidators([...validators, Validators.minLength(4)]);
    this.registerForm.get('confirmPassword').setValidators([...validators]);
    this.registerForm.get('email').setValidators([...validators, Validators.email]);

    this.imageBaseData = null;

    if (this.userInfo.forDepartureHospital && (!this.userInfo.forScienceCenter)) {
      this.registerForm.get('forDepartureHospital').patchValue(true);
    }
  }

  public get form() { return this.registerForm.controls; }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  public doLoadData = async () => {
    const storageData = sessionStorage.getItem('SecurityUserDataStorage');
    const objData = JSON.parse(storageData) as Security_UsersModel;

    if (objData != null) {
      const item = {
        sqlSelect: `it.*, MSSite.SiteName as SiteName ` +
          `, isnull(emp.Title + ' ', '') + isnull(emp.FirstName + ' ', '') + isnull(emp.LastName, '') as EmployeeName `,
        sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
          `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID)`,
        sqlWhere: `(it.UserID = '${objData?.userID}')`,
        pageIndex: -1
      };

      this.userService.getByCondition(item)
        // tslint:disable-next-line: deprecation
        .subscribe((res) => {
          const model: Security_UsersModel = Object.assign({}, res.data.SecurityUsers[0]);
          this.patchItemValues(model);

          const imgData = this.registerForm.get('signatureImage').value;
          this.imageBaseData = imgData == '' ? null : imgData;

          this.registerForm.patchValue({
            spParmLastUserID: this.registerForm.get('userID').value,
            confirmPassword: this.registerForm.get('userPassword').value,
            // sentSampleDate: new Date(sentSampleDate),
            forDepartureHospital: this.registerForm.get('forDepartureHospital').value == '1' ? true : false,
            forScienceCenter: this.registerForm.get('forScienceCenter').value == '1' ? true : false,
            isNew: false
          });

        }, (err) => {
          return this.handleError(err);
        });
    }
  }

  patchItemValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    // console.log('data to patch value -->> ', value);
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.registerForm.controls[ngName]) {
          this.registerForm.controls[ngName].patchValue(value[name]);
        }
      });
      // console.log('after patch value >> ', this.registerForm.value);
    } catch (error) {
      console.log('error >> ', error);
    }
  }

  public goBack = () => {
    sessionStorage.removeItem('SecurityUserDataStorage');

    if (window.history.length > 1) {
      this.router.navigate(['/account/list']);
    } else {
      this.router.navigate(['/']);
    }
  }

  public doNew = () => {
    this.createInitialForm();
  }

  public createUser = (ownerFormValue) => {
    if (this.registerForm.valid) {
      this.executeUserCreation(ownerFormValue);
    }
  }

  onPrepareValueChange() {
    this.securityUsersDto = {
      Security_Users: [new Security_UsersModel()],
    };

    let guId = Guid.create();
    if (this.registerForm.get('isNew').value) {
      // do nothing
    } else {
      guId = this.registerForm.get('userID').value;
    }

    this.registerForm.patchValue({
      userID: guId.toString(),
      signatureImage: this.imageBaseData,
      // sentSampleDate: this.datePipe.transform(sentSampleDate, 'yyyy-MM-dd', 'en-US'),
    });

    this.securityUsersDto.Security_Users = [Object.assign({}, this.registerForm.value)];
    // console.log('prepare Security_Users >> ', this.securityUsersDto.Security_Users);
  }

  private executeUserCreation = (userFormValue) => {
    this.onPrepareValueChange();


    return this.userService.save(this.securityUsersDto)
      // tslint:disable-next-line: deprecation
      .subscribe((res) => {
        this.isUpdated = true;
        this.spinner.hide();
        this.notiService.showSuccess('Save Successfully.');
        this.goBack();
      }, (err) => {
        this.spinner.hide();
        console.log('executeSaveData error >> ', err);
        return this.handleError(err);
      });

    // if (this.registerForm.get('isNew').value == true) {
    //   this.userService.create(this.securityUsersDto)
    //     .subscribe((res) => {
    //       this.isUpdated = true;
    //       this.spinner.hide();
    //       this.notiService.showSuccess('Create Successfully.');
    //       this.goBack();
    //     }, (err) => {
    //       this.spinner.hide();
    //       console.log('error ddddd >> ', err);
    //       return this.handleError(err);
    //     });
    // } else {
    //   this.userService.update(this.securityUsersDto)
    //     .subscribe((res) => {
    //       this.isUpdated = true;
    //       this.spinner.hide();
    //       this.notiService.showSuccess('Update Successfully.');
    //       this.goBack();
    //     }, (err) => {
    //       this.spinner.hide();
    //       console.log('error >> ', err);
    //       return this.handleError(err);
    //     });
    // }
  }

  openMSSitePicker() {
    const initialState = {
      list: [],
      title: 'หน่วยงาน',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(MssitePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.registerForm.patchValue({
          siteID: value.selectedItem['SiteID'],
          siteName: value.selectedItem['SiteName']
        });
      },
        (err: any) => {
          console.log(err);
        });
  }

  openEmployeePicker() {
    const initialState = {
      list: [],
      title: 'พนักงาน',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(EmployeePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.registerForm.patchValue({
          employeeID: value.selectedItem['EmployeeID'],
          employeeName: value.selectedItem['EmployeeName'],
          officerName: value.selectedItem['EmployeeName']
        });
      },
        (err: any) => {
          console.log(err);
        });
  }

  fileChange(e: any) {
    const file = e.srcElement.files[0];
    if (!file) {
      return;
    }

    // console.log('fileChange >> begin');
    this.imgsrc = window.URL.createObjectURL(file);
    this.handleFileInput(e.srcElement.files);
    // console.log('fileChange >> end');
  }

  public uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }

    const fileToUpload = files[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.repository.post('api/upload/upload', formData, { reportProgress: true, observe: 'events' })
      // this.http.post('http://localhost:52099/api/upload/upload', formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else
          if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
            // this.onUploadFinished.emit(event.body);
          }
      });
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

  btnUpload() {
    if (this.imageBaseData == null) {
      alert('Please select file');
    } else {
      const fileUplodVM: FileUplodVM = {
        imageBaseData: this.imageBaseData.toString()
      };

      // tslint:disable-next-line: deprecation
      this.CreateItem(fileUplodVM).subscribe((res: any) => {
        if (res) {
          alert('Successfully uploded file');
        } else {
          alert('File upload failed');
        }

      },
        error => {
          alert(error.message);
        });
    }
  }

  public CreateItem(data) {
    return this.http.post(`http://localhost:52410/api/Order/UploadFile`, data)
      .pipe(
        map((res: any) => {
          console.log(res);
          return res;
        }));
  }

}

export class FileUplodVM {
  imageBaseData: string;
}
