import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Security_UsersModel } from '@app/models';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { RepositoryService } from '@app/shared/repository.service';
import { ErrorHandlerService } from '@app/shared/error-handler.service';
import { Router } from '@angular/router';
import { BatchHDModel } from '@app/models/batchhd.model';
import Swal from 'sweetalert2';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DeliveryNoteService } from '../delivery-note.service';

@Component({
  selector: 'app-delivery-note-list',
  templateUrl: './delivery-note-list.component.html',
  styleUrls: ['./delivery-note-list.component.scss']
})
export class DeliveryNoteListComponent extends BaseComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['batchDate', 'batchNo', 'status', 'numberOfSamples', 'sampleTypeId', 'analystDays', 'dueDate', 'employeeId', 'details', 'delete'];
  public dataSource = new MatTableDataSource<BatchHDModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private repoService: RepositoryService,
    private deliveryService: DeliveryNoteService,
    private errorService: ErrorHandlerService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.getData();
  }

  public getData = () => {
    const item = {
      sqlSelect: ``
    };

    // this.deliveryService

    this.repoService.getData('api/batchhd/getAll')
      // tslint:disable-next-line: deprecation
      .subscribe(res => {
        this.dataSource.data = res['data'].BatchHDs as BatchHDModel[];
      },
        (err) => {
          return this.handleError(err);
        });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public customSort = (event) => {
    console.log(event);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (id: string) => {
    const model: BatchHDModel = {} as BatchHDModel;
    model.batchID = id;
    sessionStorage.setItem('BatchHDDataStorage', JSON.stringify(model));
    this.router.navigate(['/delivery-note/edit']);
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
        this.repoService.delete('api/batchhd/delete', [{ BatchID: id }])
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
    sessionStorage.removeItem('BatchHDDataStorage');
  }

}
