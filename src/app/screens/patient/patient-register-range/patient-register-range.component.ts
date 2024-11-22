import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MssitePickerComponent } from '@app/pickers';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { LISSentSampleHDModel } from '@app/models';
import { AuthenticationService, UtilitiesService } from '@app/services';
import { DatePipe } from '@angular/common';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { RegisterRangeFormModel } from '@app/models/register-range-form.model';

defineLocale('th', thBeLocale);

@Component({
  selector: 'app-patient-register-range',
  templateUrl: './patient-register-range.component.html',
  styleUrls: ['./patient-register-range.component.scss']
})
export class PatientRegisterRangeComponent extends BaseComponent implements OnInit {
  // @Input() range: FormGroup;
  @Input() forScienceCenter: boolean = true;
  @Output() uploaded = new EventEmitter<any>();
  @ViewChild(MatExpansionPanel, { static: true }) rangePanel: MatExpansionPanel;

  locale = 'th';
  rangeForm: FormGroup;
  collapsed: boolean = false;
  panelRangeOpenState: boolean = true;

  rangeSelectedValue: string = 'ThisMonth';

  public bsModalRef: BsModalRef;
  private defaultValue = {
    siteID: '',
    siteName: '',
    userName: '',
    employeeID: '',
    employeeName: '',
    sentToSiteID: '',
    sentToSiteName: '',
    forScienceCenter: false
  };

  dateRange = [
    { value: 'LastYear', text: 'Last Year' },
    { value: 'LastMonth', text: 'Last Month' },
    { value: 'LastWeek', text: 'Last Week' },
    { value: 'ThisYear', text: 'This Year' },
    { value: 'ThisMonth', text: 'This Month' },
    { value: 'ThisWeek', text: 'This Week' },
    { value: 'Today', text: 'Today' },
    { value: 'All', text: 'All' },
  ];

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private utilService: UtilitiesService,
    private authService: AuthenticationService,
    public datepipe: DatePipe,
    private sentSampleService: SentSampleService,
  ) {
    super();
    this.localeService.use(this.locale);

    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.defaultValue.siteID = user?.data?.SecurityUsers?.SiteID;
        this.defaultValue.siteName = user?.data?.SecurityUsers?.SiteName;
        this.defaultValue.employeeID = user?.data?.SecurityUsers?.EmployeeID;
        this.defaultValue.sentToSiteID = user?.data?.SecurityUsers?.ParentSiteID;
        this.defaultValue.forScienceCenter = user?.data?.SecurityUsers?.ForScienceCenter;
      }
    });
  }

  ngOnInit(): void {




    //this.authService.currentUser.subscribe((user: any) => {
    //  if (user?.data?.SecurityUsers.ForDepartureHospital == true && user?.data?.SecurityUsers.ForScienceCenter == false) {
    //    $("#btnclear").addClass('d-none');
    //  } else {
    //    $("#btnclear").removeClass('d-none');
    //  }
    //});



    this.createInitialRangeForm();

    this.rangeForm.get('dateRangeSelectedValue').valueChanges
      .subscribe(f => {
        this.onRangeChange();
      });

    this.rangeForm.patchValue({ dateRangeSelectedValue: 'ThisMonth' });
    this.onRangeChange();
    //document.getElementById('btnSearchTest').click();
    this.rangeForm.patchValue({
      // userName: this.defaultValue.userName,
      siteID: this.defaultValue.siteID,
      siteName: this.defaultValue.siteName,
      // employeeID: this.defaultValue.employeeID,
      // employeeName: this.defaultValue.employeeName,
      // sentToSiteID: this.defaultValue.sentToSiteID,
      // sentToSiteName: this.defaultValue.sentToSiteName
    });

    //document.getElementById('btnsearchtest').click();
      //this.doSearchClick();
        //document.getElementById('btnSearchTest').click();


  }
  clickMe(event: Event) {
    // this._snackBar.open('Look at the method "clickMe" too!', null, {
    //   duration: 1000,
    // });

    event.stopPropagation();
  }

  // uploadComplete() {
  //   this.uploaded.emit('complete');
  // }

  createInitialRangeForm = () => {
    this.rangeForm = this.fb.group(new RegisterRangeFormModel());
    // this.range = this.fb.group(new RegisterRangeForm());
    console.log(this.rangeForm,'this.rangeForm');
    this.rangeForm.patchValue({
      documentStatus: 'Draft'
    });
  }

  //clearSite() {
  //  let inputElement = (document.getElementById("input-siteName") as HTMLInputElement).value = '';
  //}

  public onRangeChange = () => {
    const rangeValue = this.rangeForm.get('dateRangeSelectedValue').value;

    console.log('rangeValue =>  ', rangeValue);
    const range = this.utilService.getDateRange(rangeValue);

    this.rangeForm.patchValue({
      fromSentSampleDate: range ? range.start : null,
      toSentSampleDate: range ? range.end : null,
      //fromCreatedDate: range ? range.start : null,
      //toCreatedDate: range ? range.end : null
    });

    // this.getData();
  }

  public getData = () => {
    //console.log('Item GetData');
    const item = {
      sqlSelect: `it.*, MSSite.SiteName As SiteName, emp.FirstName + ' ' + emp.LastName as EmployeeName ` +
        `, (SELECT count(requestid) from Requests where SentSampleID = it.SentSampleID and Requests.RequestStatus = 'Approved') as ApproveCount ` +
        `, (select top 1 isnull(title, '') + isnull(firstname + ' ', '') + isnull(lastname, '') from requests where requests.SentSampleID = it.SentSampleID order by requests.LabNumber asc) as PatientNameLists`,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID) ` +
        `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID)`,
      sqlWhere: this.defaultValue.forScienceCenter == true ? `` : `(it.SiteID = '${this.defaultValue.siteID}')`,
      sqlOrder: `Convert(varchar(10), it.SentSampleDate, 112) Desc, it.SentSampleNo Desc`,
      pageIndex: -1
    };

    const range = this.utilService.getDateRange(this.rangeSelectedValue);
    if (range) {
     
      const startDate = this.datepipe.transform(range.start, 'yyyyMMdd');
      const endDate = this.datepipe.transform(range.end, 'yyyyMMdd');
      item.sqlWhere += item.sqlWhere ? ` and (it.sentSampleDate between '${startDate}' and '${endDate}')` : ` (it.sentSampleDate between '${startDate}' and '${endDate}')`;


    }

    this.sentSampleService.getLISSentSampleHDByCondition(item)
      .subscribe(res => {
        // this.dataSource.data = res.data.LISSentSampleHDs as LISSentSampleHDModel[];
      },
        (err) => {
          return this.handleError(err);
        });
  }

  dateInputChange = (ev) => {
    // console.log('date change : ', ev);
  }

  doSearchClick = () => {
    //console.log('eeeeeeeeeeee');
    //console.log('this.rangeForm =>', this.rangeForm);
    //this.rangePanel.close();
    //let inputElement = (document.getElementById("input-ReceiveDate") as HTMLInputElement).value;
    //console.log(inputElement,'inputElement');
    this.uploaded.emit(this.rangeForm);
    //this.spinner.hide();
  }

  clearSite = () => {
    this.rangeForm.patchValue({
      siteID: '',
      siteName: ''
    });
  }

  openMSSitePicker() {
    const initialState = {
      list: [
        this.rangeForm.get('siteCode').value
      ],
      whereClause: `it.SiteFlag != 'P'`,
      title: 'Site',
      class: 'my-class'
    };

    this.bsModalRef = this.bsModalService.show(MssitePickerComponent, { initialState, class: 'modal-lg', backdrop: 'static' });
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.action
      .subscribe((value: any) => {
        if (!value || value.isCancel) { return; }
        this.rangeForm.patchValue({
          siteID: value.selectedItem['SiteID'],
          siteName: value.selectedItem['SiteName'],

          sentToSiteID: value.selectedItem['ParentSiteID'],
          sentToSiteName: value.selectedItem['ParentSiteName'],
        });
        // this.defaultValue.siteID = value.selectedItem['SiteID'];
        // this.runPrefix = value.selectedItem['RunPrefix'];
      },
        (err: any) => {
          console.log(err);
        });

  }
  fromLabNumberKeyup = (ev: any) => {
    //console.log('evv => ',ev);
    this.rangeForm.patchValue({
      toSampleNo: ev.target.value
    })
  }

}
