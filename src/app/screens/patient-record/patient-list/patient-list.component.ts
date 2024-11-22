import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { RepositoryService } from '@app/shared/repository.service';
import { ErrorHandlerService } from '@app/shared/error-handler.service';
import { Router } from '@angular/router';
import { MSLISPatientModel } from '@app/models/mslispatient.model';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['idCard', 'firstName', 'lastName', 'details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<MSLISPatientModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private repoService: RepositoryService,
    private errorService: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllOwners();
  }

  public getAllOwners = () => {
    this.repoService.getData('api/mslispatient/getAll')
      .subscribe(res => {
        console.log('res >> ', res);
        this.dataSource.data = res['data'].MSLISPatients as MSLISPatientModel[];
      },
        (error) => {
          console.log('get error >> ', error);
          // this.errorService.handleError(error);
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
    const url = `/owner/details/${id}`;
    this.router.navigate([url]);
  }

  public redirectToUpdate = (id: string) => {
    const url = `/owner/update/${id}`;
    this.router.navigate([url]);
  }

  public redirectToDelete = (id: string) => {
    const url = `/owner/delete/${id}`;
    this.router.navigate([url]);
  }

}
