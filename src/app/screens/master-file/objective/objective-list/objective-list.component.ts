import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { Router, Data } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import Swal from 'sweetalert2';
import { MasterFileService } from '../../master-file.service';
import { MSLabProfileModel } from '@app/models';

@Component({
  selector: 'app-objective-list',
  templateUrl: './objective-list.component.html',
  styleUrls: ['./objective-list.component.scss']
})

export class ObjectiveListComponent extends BaseComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'profileCode', 'profileName', 'profileNameEng',
    'days', 'isDefault', 'details', 'delete'
  ];
  public dataSource = new MatTableDataSource<MSLabProfileModel>();
  public permissions: Data;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private masterFileService: MasterFileService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getAllLabProfile();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public getAllLabProfile = () => {
    // this.repoService.getData('api/MSLabSampleType/getAll')
    this.masterFileService.getMsProfile()
      .subscribe(res => {
        this.dataSource.data = res['data'].MSLabProfiles as MSLabProfileModel[];
      },
        (error) => {
          console.log('get error >> ', error);
          // this.errorService.handleError(error);
        });
  }

  public customSort = (event: any) => {
    console.log(event);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (id: string) => {
    // const url = `/owner/details/${id}`;
    // this.router.navigate([url]);
    const model: MSLabProfileModel = {} as MSLabProfileModel;
    model.profileID = id;
    // const model: MSLabSampleTypeModel = Object.assign({}, quotation);
    // this.router.navigate(['/sbm/quotation/info'], navigationExtras);
    sessionStorage.setItem('MSLabProfileDataStorage', JSON.stringify(model));
    // this.communicationService.raiseEvent(quotation);
    // this.navCtrl.navigate('/sbm/quotation/info', { quotation });
    this.router.navigate(['/master-file/objective/edit']);

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
  }

  public redirectToDelete = (id: string) => {
    console.log('id >> ', id);
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
        this.masterFileService.deleteLabProfile([{ ProfileID: id }])
          .subscribe(res => {
            console.log('res >> ', res);

            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            ).then(() => {
              this.getAllLabProfile();
            });
          });
      }
    });
  }

  public onCreateNew = () => {
    sessionStorage.removeItem('MSLabProfileDataStorage');
  }

}
