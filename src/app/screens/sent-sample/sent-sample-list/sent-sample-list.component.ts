import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import Swal from 'sweetalert2';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { LISSentSampleHDModel } from '@app/models';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { Router, Data } from '@angular/router';
import { ErrorHandlerService } from '@app/shared/error-handler.service';
import { RepositoryService } from '@app/shared/repository.service';
import { MatSort } from '@angular/material/sort';
import { SentSampleService } from '../sent-sample.service';
import { utils } from 'protractor';
import { AuthenticationService, UtilitiesService } from '@app/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

// import { registerLocaleData } from '@angular/common';
// import thBeLocale from '@angular/common/locales/th';
// import { BsLocaleService } from 'ngx-bootstrap/datepicker';
// registerLocaleData(thBeLocale, 'th');

declare var $: any;

@Component({
  selector: 'app-sent-sample-list',
  templateUrl: './sent-sample-list.component.html',
  styleUrls: ['./sent-sample-list.component.scss']
})
export class SentSampleListComponent extends BaseComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] =
    [
      'id', 'SentSampleDate',
      'NumberOfSamples', 'SiteName', 'UserName', 'EmployeeName', 'PatientName',
      'status', 'details', 'delete'
    ];
  public dataSource = new MatTableDataSource<LISSentSampleHDModel>();
  public isReceived: boolean = false;
  currentSampleID: string = '';
  rangeSelectedValue: string = 'ThisMonth';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('reportSelector') reportSelector: ElementRef;
  @ViewChild('multipleRangeParams') multipleRangeParams: ElementRef;

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

  reportType: string = 'cover';
  reportOption: string = 'single';
  rangeForm: FormGroup;

  constructor(
    private repoService: RepositoryService,
    private router: Router,
    private sentSampleService: SentSampleService,
    private utilService: UtilitiesService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    public datepipe: DatePipe
  ) {
    super();
    // this.localeService.use('th');

    // tslint:disable-next-line: deprecation
    this.authService.currentUser.subscribe((user: any) => {
      if (user != null) {
        this.defaultValue.siteID = user?.data?.SecurityUsers?.SiteID;
        this.defaultValue.employeeID = user?.data?.SecurityUsers?.EmployeeID;
        this.defaultValue.sentToSiteID = user?.data?.SecurityUsers?.ParentSiteID;
        this.defaultValue.forScienceCenter = user?.data?.SecurityUsers?.ForScienceCenter;
      }
    });
    this.createInitialForm();
  }

  ngOnInit() {
    this.getData();
  }

  createInitialForm = () => {
    this.rangeForm = this.fb.group({
      templateID: '',
      fromSentSampleDate: [new Date()],
      toSentSampleDate: [new Date()],
      sampleTypeID: [''],
      sampleTypeName: [''],
      profileID: [''],
      profileName: [''],
      isExportDup: [false]
    });
  }

  public getData = () => {
    // console.log('siteid >> ', this.defaultValue.siteID);
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
     // item.sqlWhere += item.sqlWhere ? ` and (it.sentSampleDate between '${startDate}' and '${endDate}')` : ` (it.sentSampleDate between '${startDate}' and '${endDate}')`;
    }

    this.sentSampleService.getLISSentSampleHDByCondition(item)
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        console.log('res => ', res)
        this.dataSource.data = res.data.LISSentSampleHDs as LISSentSampleHDModel[];
      },
        (err) => {
          return this.handleError(err);
        });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public onRangeChange = () => {
    // const range = this.utilService.getDateRange(this.rangeSelectedValue);
    this.getData();
    // console.log('range >> ', range);
  }

  public customSort = (event) => {
    console.log(event);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (id: string) => {
    const model: LISSentSampleHDModel = {} as LISSentSampleHDModel;
    model.sentSampleID = id;
    sessionStorage.setItem('LISSentSampleHDDataStorage', JSON.stringify(model));
    this.router.navigate(['/sent-sample/edit']);
  }

  public doPrint = (id: string) => {

  }

  public redirectToUpdate = (id: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully </br>ccccccccccccc</br> cccccccccccccc'
    });
  }

  public redirectToDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to delete this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.repoService.delete('api/LISSentSampleHD/delete', [{ SentSampleID: id }])
          // tslint:disable-next-line: deprecation
          .subscribe((res) => {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            ).then(() => {
              this.getData();
            });
          });
      }
    });
  }

  public onCreateNew = () => {
    sessionStorage.removeItem('LISSentSampleHDDataStorage');
    this.router.navigate(['/sent-sample/create']);
  }

  doPrintRange = () => {

  }

  onReportSelected = () => {
    $(this.reportSelector.nativeElement).modal('hide');
    console.log('report option >> ', this.reportType);
    if (this.reportOption == 'single') {
      // Swal.fire('single item').then(() => {
      //   this.goToReport(this.reportType == 'cover' ? 'CoverDeliveryNoteReport' : 'DeliveryNoteReport');
      // });
      this.goToReport(this.reportType == 'cover' ? 'CoverDeliveryNoteReport' : 'DeliveryNoteReport');
    } else {
      // Swal.fire('multiple item')
      //   .then(() => {
      //     $(this.multipleRangeParams.nativeElement).modal('show');
      //   });
      $(this.multipleRangeParams.nativeElement).modal('show');
    }
  }

  onReportPrintClick = async (id: string) => {
    console.log('SentSampleID >> ', id);
    this.currentSampleID = id;
    if (id == null) {
      this.reportOption = 'multiple';
      $(this.reportSelector.nativeElement).modal('show');
    } else {
      this.reportOption = 'single';
      $(this.reportSelector.nativeElement).modal('show');
    }
  }

  goToReport(reportName: string) {
    // this.router.navigate(['/report'], { queryParams: { report: reportName } });

    // const newRelativeUrl = this.router.createUrlTree(['/report'], { queryParams: { report: reportName } });
    // const baseUrl = window.location.href.replace(this.router.url, '');
    // window.open(baseUrl + newRelativeUrl, '_blank');

    const newRelativeUrl = this.router.createUrlTree(['/report-viewer'],
      { queryParams: { report: reportName, sqlWhere: `SentSampleID='${this.currentSampleID}'` } });
    const baseUrl = window.location.href.replace(this.router.url, '');
    window.open(baseUrl + newRelativeUrl, '_blank');
  }

}
