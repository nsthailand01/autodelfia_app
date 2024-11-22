import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { MSEmployeeModel } from '@app/models';
import Swal from 'sweetalert2';
import { MasterFileService } from '../../master-file.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent extends BaseComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'employeeCode', 'firstName', 'lastName', 'identityCard',
    'details', 'delete'
  ];
  public dataSource = new MatTableDataSource<MSEmployeeModel>();

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
    this.masterFileService.getEmployee()
      .subscribe(res => {
        this.dataSource.data = res['data'].MSEmployees as MSEmployeeModel[];
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
    const model: MSEmployeeModel = {} as MSEmployeeModel;
    model.employeeID = id;
    sessionStorage.setItem('MSEmployeeDataStorage', JSON.stringify(model));
    this.router.navigate(['/master-file/employee/edit']);
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
        this.masterFileService.deleteEmployee([{ EmployeeID: id }])
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
    sessionStorage.removeItem('MSEmployeeDataStorage');
  }

}
