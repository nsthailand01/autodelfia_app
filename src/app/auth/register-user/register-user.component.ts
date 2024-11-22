import { Component, OnInit, ElementRef, ChangeDetectorRef, OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { RepositoryService } from '@app/shared/repository.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ErrorHandlerService } from '@app/shared/error-handler.service';
import { SuccessDialogComponent } from '@app/shared/dialogs/success-dialog/success-dialog.component';
import { MustMatch } from '@app/helpers/must-match.validator';
import { Security_UsersModel } from '@app/models';
import { GuidServices } from '@app/services/guid.services';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

  public registerForm: FormGroup;
  private dialogConfig;
  iAgreeChecked = false;
  returnUrl: string;

  constructor(
    private elementRef: ElementRef,
    private location: Location,
    private repository: RepositoryService,
    private dialog: MatDialog,
    private errorService: ErrorHandlerService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    super();
  }

  ngOnInit() {
    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: {}
    };

    this.createInitialForm();
  }

  createInitialForm() {
    // this.registerForm = this.fb.group(new Security_UsersModel());
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

    // if (this.userInfo.forDepartureHospital && (!this.userInfo.forScienceCenter)) {
    //   this.registerForm.get('forDepartureHospital').patchValue(true);
    // }

    // this.registerForm = this.fb.group({
    //   userID: [''],
    //   spParmUserID: [''],
    //   employeeID: [''],
    //   hNID: [''],
    //   siteID: [''],
    //   userGroupID: [''],
    //   userName: ['', [Validators.required, Validators.maxLength(25)]],
    //   userPassword: ['', [Validators.required, Validators.minLength(4)]],
    //   email: ['', [Validators.required, Validators.email]],
    //   confirmPassword: ['', Validators.required],
    //   tel: [''],
    //   createDate: [new Date()],
    //   beginDate: [new Date()],
    //   endDate: [new Date()],
    //   userSatatus: ['A'],
    //   userType: ['U'],
    //   isDuplicateLogin: [''],
    //   approveby: [0],
    //   approveDate: [null],
    //   tokenResetPassword: [''],
    //   picture: [''],
    //   accessToken: [''],
    //   isNew: [true],
    // },
    //   {
    //     validator: MustMatch('userPassword', 'confirmPassword')
    //   });
  }

  ngAfterViewInit() {
    // this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "url('../../../assets/img/bg-cyan.jpg')";
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = `url('assets/img/bg-cyan.jpg')`;
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundSize = 'cover';
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundPosition = '50% 50%';
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundAttachment = 'fixed';

    // this.renderer.setStyle(document.body, 'background-color', 'yellow');
  }

  ngOnDestroy() {
    this.renderer.removeStyle(document.body, 'background-image');
    this.renderer.removeStyle(document.body, 'background-size');
    this.renderer.removeStyle(document.body, 'background-position');
    this.renderer.removeStyle(document.body, 'background-attachment');
  }

  public get form() { return this.registerForm.controls; }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {
    this.location.back();
  }

  public createUser = (userFormValue) => {
    console.log('form valid >> ', this.registerForm.valid);
    if (this.registerForm.valid) {
      this.executeUserCreation(userFormValue);
    }
  }

  showOptions($event) {
    this.changeDetectorRef.detectChanges();
    this.iAgreeChecked = $event.checked;
    console.log('check change > ', $event);
    console.log('agreeChecked >> ', this.iAgreeChecked);

  }

  private executeUserCreation = (userFormValue) => {
    const item = {
      Security_Users: new Array<Security_UsersModel>()
    };
    this.registerForm.patchValue({
      forDepartureHospital: true,
      forScienceCenter: false,
      userSatatus: 'A',
      userType: 'U',
      isReporter: false,
      isApprover: false,
    });

    item.Security_Users = [Object.assign({}, this.registerForm.value)];
    console.log('user >> ', item);

    const apiUrl = 'api/security_users/create';
    this.repository.create(apiUrl, item)
      .subscribe(res => {
        const dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);

        dialogRef.afterClosed()
          .subscribe(result => {
            this.location.back();
          });
      },
        (err => {
          console.log('register error >> ', err);
          this.handleError(err);
          // this.errorService.dialogConfig = { ...this.dialogConfig };
          // this.errorService.handleError(err);
        })
      );
  }
}
