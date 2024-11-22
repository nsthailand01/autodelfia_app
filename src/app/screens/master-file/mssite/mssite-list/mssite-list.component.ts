import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MSSiteModel } from '@app/models';
import { MasterFileService } from '../../master-file.service';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mssite-list',
  templateUrl: './mssite-list.component.html',
  styleUrls: ['./mssite-list.component.scss']
})
export class MssiteListComponent extends BaseComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'siteCode', 'siteName', 'siteNameEng', 'shortName', 'taxId', 'companyRegisterNo',
    'details', 'delete'
  ];
  public dataSource = new MatTableDataSource<MSSiteModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private masterFileService: MasterFileService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadLists();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public loadLists = () => {
    this.masterFileService.getSite()
      .subscribe(res => {
        this.dataSource.data = res['data'].MSSites as MSSiteModel[];
      },
        (error) => {
          console.log('get error >> ', error);
        });
  }

  public customSort = (event: any) => {
    console.log(event);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (id: string) => {
    const model: MSSiteModel = {} as MSSiteModel;
    model.siteID = id;
    sessionStorage.setItem('MSSiteDataStorage', JSON.stringify(model));
    this.router.navigate(['/master-file/mssite/edit']);
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
        this.masterFileService.deleteSite([{ SiteID: id }])
          .subscribe(res => {
            console.log('res >> ', res);

            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            ).then(() => {
              this.loadLists();
            });
          }, err => {
            this.toastrNotiService.error(err.error.statusText);
          });
      }
    });
  }

  public onCreateNew = () => {
    sessionStorage.removeItem('MSSiteDataStorage');
  }

}
