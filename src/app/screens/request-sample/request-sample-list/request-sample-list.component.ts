import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { RequestsModel } from '@app/models';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { RepositoryService } from '@app/shared/repository.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RequestsService } from '../requests.service';
import { UtilitiesService } from '@app/services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-request-sample-list',
  templateUrl: './request-sample-list.component.html',
  styleUrls: ['./request-sample-list.component.scss']
})
export class RequestSampleListComponent extends BaseComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['id',
    'LabNumber', 'SiteName', 'ReceiveNo', 'ShiptoNo',
    'ShiptoDate', 'SampleTypeName', 'FullName',
    'IdentityCard', 'InputPercentage', 'percentage',
    'details', 'delete'
  ];
  public dataSource = new MatTableDataSource<RequestsModel>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  rangeSelectedValue: string = 'ThisMonth';

  constructor(
    private repoService: RepositoryService,
    private router: Router,
    private requestService: RequestsService,
    private utilService: UtilitiesService,
    public datepipe: DatePipe
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getAllRequests();
  }

  public getAllRequests = () => {
    const item = {
      sqlSelect: `it.*, MSSite.SiteName As SiteName, sampleType.SampleTypeName, profile.ProfileName,
      sent.SentSampleNo, sent.NumberOFSamples, [dbo].[fn_Requests_InputPercentage](it.RequestID) as InputPercentage`,
      sqlFrom: `Left Outer Join MSSite On (MSSite.SiteID = it.SiteID)
      Left Outer Join MSLabSampleType as sampleType On (sampleType.SampleTypeID = it.SampleTypeID)
      Left Outer Join MSLabProfile as profile On (profile.ProfileID = it.ProfileID)
      Left Outer Join LISSentSampleHD as sent On (sent.SentSampleID = it.SentSampleID)`,
      sqlOrder: `it.LabNumber Desc`,
      sqlWhere: ``,
      pageIndex: -1
    };

    const range = this.utilService.getDateRange(this.rangeSelectedValue);
    if (range) {
      const startDate = this.datepipe.transform(range.start, 'yyyyMMdd');
      const endDate = this.datepipe.transform(range.end, 'yyyyMMdd');
      item.sqlWhere += item.sqlWhere ? ` and (it.shiptoDate between '${startDate}' and '${endDate}')` : ` (it.shiptoDate between '${startDate}' and '${endDate}')`;
    }

    this.requestService.getByCondition(item)
      // this.repoService.getData('api/requests/getAll')
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        // console.log('res >> ', res);
        this.dataSource.data = res['data'].Requests as RequestsModel[];
      },
        (err) => {
          return this.handleError(err);
        });
  }

  public onRangeChange = () => {
    // const range = this.utilService.getDateRange(this.rangeSelectedValue);
    this.getAllRequests();
    // console.log('range >> ', range);
  }

  public customSort = (event: any) => {
    console.log(event);

    const sortState: Sort = event;
    this.sort.active = sortState.active;
    this.sort.direction = sortState.direction;
    // this.sort.sortChange.emit(sortState);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (id: string) => {
    const model: RequestsModel = {} as RequestsModel;
    model.requestID = id;
    sessionStorage.setItem('RequestsSampleDataStorage', JSON.stringify(model));
    this.router.navigate(['/request-sample/edit']);
  }

  public redirectToUpdate = (id: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: 'success',
      title: 'Signed in successfully </br>ccccccccccccc</br> cccccccccccccc'
    });

    // const url = `/owner/update/${id}`;
    // this.router.navigate([url]);
  }

  public redirectToDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to delete this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.repoService.delete('api/requests/delete', [{ RequestID: id }])
          // tslint:disable-next-line: deprecation
          .subscribe(res => {
            console.log('res >> ', res);

            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            ).then(() => {
              this.getAllRequests();
            });
          });
      }
    });

    // const url = `/owner/delete/${id}`;
    // this.router.navigate([url]);
  }

  public onCreateNew = () => {
    sessionStorage.removeItem('RequestsSampleDataStorage');
  }

}
