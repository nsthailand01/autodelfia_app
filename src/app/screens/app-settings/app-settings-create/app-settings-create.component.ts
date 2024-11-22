import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MpAppSettingsModel } from '@app/models/mpappsettings.model';
import { AuthenticationService, ToastrNotificationService, UtilitiesService } from '@app/services';
import { AutoLogoutService } from '@app/services/auto-logout.service';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MpAppSettingsService } from '../mp-app-settings.service';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
// import ThaiSmartcardReader from 'thai-smartcard-reader'
import { Location } from '@angular/common';
const thaiIdCard = require('thai-id-card')
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-app-settings-create',
  templateUrl: './app-settings-create.component.html',
  styleUrls: ['./app-settings-create.component.scss']
})
export class AppSettingsCreateComponent implements OnInit {

  employeeName: string = '';
  UserID: string = '';
  public appSettingsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appSettingsService: MpAppSettingsService,
    private notiService: ToastrNotificationService,
    private authService: AuthenticationService,
    private utilService: UtilitiesService,
    private autoLogoutService: AutoLogoutService,
    private sentSampleService: SentSampleService,
    private location: Location,
    private router: Router, private route: ActivatedRoute
  ) {

    this.authService.currentUser.subscribe((user: any) => {
      if (user !== null) {
        this.employeeName = user.data?.SecurityUsers?.EmployeeName == '' ? user.data?.SecurityUsers?.UserName : user.data?.SecurityUsers?.EmployeeName;
      }
    });

    this.createInitialForm();
  }



  ngOnInit(): void {

    //เอาcommentออก
    this.doLoad();

    this.GetResultCurrent();

  }

  createInitialForm() {
    const validators = [Validators.required];

    this.appSettingsForm = this.fb.group(new MpAppSettingsModel());
    // this.appSettingsForm.get('userName').setValidators([...validators, Validators.maxLength(25)]);
    // console.log('form => ', this.appSettingsForm.getRawValue());
  }


  GetResultCurrent = () => {



    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.UserID = user?.data?.SecurityUsers?.UserID;
      }
    });
    const query = ` SELECT  MinAmount
                    FROM Security_Users
                   Where UserID = '${this.UserID}'
                         `;
    const response = this.sentSampleService.query({ queryString: query });
    response.then(data => {
      //console.log('Response => ', data.data.response);
      for (let el of data.data.response) {

        if (el.minAmount != null) {
          $('#autoLogoutInMinutes').val(el.minAmount);
        } else {
          $('#autoLogoutInMinutes').val(0);
        }
      }

    });
  }




  doLoad = () => {
    this.appSettingsService.getAll()
      .subscribe(res => {
        // console.log('res => ', res);
        let model: MpAppSettingsModel = new MpAppSettingsModel();
        if (res.data.MpAppSettings.length > 0) {
          model = Object.assign({}, res.data.MpAppSettings[0]);
        }

        this.patchItemValues(model);

        // console.log('model => ', model);

        // this.appSettingsForm.patchValue({
        //   confirmPasswordOnApprove: model.confirmPasswordOnApprove ? 'N' : 'Y',
        //   requireApproveRemark: model.requireApproveRemark ? 'N' : 'Y',
        //   allowSentWhenIncomplete: model.allowSentWhenIncomplete ? 'N' : 'Y',
        // });

        // console.log('form xx => ', this.appSettingsForm.getRawValue());
      })
  }

  doSave = () => {




    try {

      this.authService.currentUser.subscribe((user: any) => {
        if (user != null) {
          this.UserID = user?.data?.SecurityUsers?.UserID;
        }
      });


      //console.log('UserID => ', this.UserID);
      //console.log('autoLogoutInMinutes => ', $('#autoLogoutInMinutes').val());
      //for (let el of dataSource) {
      const query = ` Update  Security_Users
                    Set  MinAmount = '${$('#autoLogoutInMinutes').val()}'
                    Where UserID = '${this.UserID}'
                         `;
      const response = this.sentSampleService.query({ queryString: query });

      Swal.fire({
        title: 'การบันทึกข้อมูลสำเร็จ',
        icon: 'success',
      }).then(() => {
        window.location.reload()
      });

    } catch (e) {
      console.log('error => ', e);
    }
    //try {

    //  console.log('vale => ', this.appSettingsForm.get('id').value);

    //  if (this.appSettingsForm.get('id').value) {
    //    this.appSettingsService.update(this.appSettingsForm.getRawValue())
    //      .subscribe((res) => {
    //        // console.log('res => ', res);
    //        this.appSettingsForm.patchValue({
    //          id: res.data.MpAppSettings.Id,
    //        });

    //        // this.notiService.showSuccess('การบันทึกข้อมูลสำเร็จ');
    //        Swal.fire({
    //          title: `การบันทึกข้อมูลสำเร็จ`,
    //          icon: `success`,
    //        }).then(() => {
    //          this.autoLogoutService.initialize();
    //        });
    //      });
    //  } else {
    //    this.appSettingsService.create(this.appSettingsForm.getRawValue())
    //      .subscribe((res) => {
    //        // console.log('res => ', res);
    //        this.appSettingsForm.patchValue({
    //          id: res.data.MpAppSettings.Id,
    //        });

    //        // this.notiService.showSuccess('การบันทึกข้อมูลสำเร็จ');
    //        Swal.fire({
    //          title: `การบันทึกข้อมูลสำเร็จ`,
    //          icon: `success`,
    //        });
    //      });
    //  }

    //} catch (err) {
    //  this.notiService.showError(err);
    //}

  }

  patchItemValues(value: { [key: string]: any }, { onlySelf, emitEvent }: { onlySelf?: boolean, emitEvent?: boolean } = {}) {
    try {
      Object.keys(value).forEach(name => {
        const ngName = name.replace(name[0], name[0].toLowerCase());
        if (this.appSettingsForm.controls[ngName]) {
          this.appSettingsForm.controls[ngName].patchValue(value[name]);
        }
      });
    } catch (error) {
      console.log('error >> ', error);
    }
  }
}
