import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Security_UsersModel } from '@app/models';
import { MatSort } from '@angular/material/sort';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { RepositoryService } from '@app/shared/repository.service';
import { ErrorHandlerService } from '@app/shared/error-handler.service';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import Swal from 'sweetalert2';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { AuthenticationService } from '@app/services';
registerLocaleData(localeTh, 'th');

@Component({
  selector: 'app-user-account-list',
  templateUrl: './user-account-list.component.html',
  styleUrls: ['./user-account-list.component.scss']
})
export class UserAccountListComponent extends BaseComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['userName', 'employeeName', 'email', 'tel', 'details', 'delete'];
  public dataSource = new MatTableDataSource<Security_UsersModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // forDepartureHospital: boolean = false;
  // forScienceCenter: boolean = false;

  public userInfo = {
    forDepartureHospital: false,
    forScienceCenter: false
  };

  constructor(
    private authService: AuthenticationService,
    private repoService: RepositoryService,
    private errorService: ErrorHandlerService,
    private router: Router
  ) {
    super();

    // tslint:disable-next-line: deprecation
    this.authService.currentUser.subscribe((user: any) => {
      this.userInfo.forDepartureHospital = user?.data?.SecurityUsers?.ForDepartureHospital;
      this.userInfo.forScienceCenter = user?.data?.SecurityUsers?.ForScienceCenter;
    });
  }

  ngOnInit() {
    this.getAllUsers();
  }

  public getAllUsers = () => {
    let sqlWhere = '';
    if (this.userInfo.forDepartureHospital && (!this.userInfo.forScienceCenter)) {
      sqlWhere = `IsNull(it.ForDepartureHospital, 1) = 1`;
    } else {
      sqlWhere = '';
    }

    const item = {
      sqlSelect: `it.*` +
        `, isnull(emp.Title + ' ', '') + isnull(emp.FirstName + ' ', '') + isnull(emp.LastName, '') as EmployeeName `,
      sqlFrom: `Left Outer Join MSEmployee as emp On (emp.EmployeeID = it.EmployeeID)`,
      sqlOrder: `UserName Asc, EmployeeName Asc`,
      sqlWhere
    };
    this.repoService.getDataParm('api/security_users/getByCondition', item)
      .subscribe((res: any) => {
        this.dataSource.data = res['data'].SecurityUsers as Security_UsersModel[];
      },
        (err: any) => {
          this.handleError(err);
        });
  }

  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public customSort = (event) => {
    // console.log(event);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public onCreateNew = () => {
    sessionStorage.removeItem('SecurityUserDataStorage');
  }

  public redirectToDetails = (id: string) => {
    const model: Security_UsersModel = {} as Security_UsersModel;
    model.userID = id;
    sessionStorage.setItem('SecurityUserDataStorage', JSON.stringify(model));
    this.router.navigate(['/account/edit']);
  }

  public redirectToUpdate = (id: string) => {
    const url = `/owner/update/${id}`;
    this.router.navigate([url]);
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
        this.repoService.delete('api/security_users/delete', [{ UserID: id }])
          // tslint:disable-next-line: deprecation
          .subscribe((res) => {
            Swal.fire(
              'Deleted!',
              'Your data has been deleted.',
              'success'
            ).then(() => {
              this.getAllUsers();
            });
          });
      }
    });
  }

}
