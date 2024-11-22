import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { MSLabGroupModel } from '@app/models';
import { ImportExportTemplateHDModel } from '@app/models/importexporttemplatehd.model';
import Swal from 'sweetalert2';
import { ImportExportService } from '../import-export.service';

@Component({
  selector: 'app-import-export-list',
  templateUrl: './import-export-list.component.html',
  styleUrls: ['./import-export-list.component.scss']
})
export class ImportExportListComponent extends BaseComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['id',
    'templateType', 'templateName', 'columnDelimiter', 'fileEncoding', 'headerRow', 'firstDataRow', 'details', 'delete'
  ];
  public dataSource = new MatTableDataSource<ImportExportTemplateHDModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private importExportService: ImportExportService
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
    // this.masterFileService.getLabGroup()
    //   .subscribe(res => {
    //     this.dataSource.data = res['data'].MSLabGroups as MSLabGroupModel[];
    //   },
    //     (error) => {
    //       console.log('get error >> ', error);
    //     });

    const item = {
      sqlSelect: `it.*`,
      sqlFrom: ``,
      sqlOrder: `it.TemplateType Asc, it.TemplateName Asc`,
      pageIndex: -1
    };

    this.importExportService.getByCondition(item)
      .subscribe(res => {
        this.dataSource.data = res['data'].ImportExportTemplateHDs as ImportExportTemplateHDModel[];
      },
        (err) => {
          return this.handleError(err);
        });
  }

  public customSort = (event: any) => {
    console.log(event);
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (id: string) => {
    const model: ImportExportTemplateHDModel = {} as ImportExportTemplateHDModel;
    model.templateID = id;
    sessionStorage.setItem('ImportExportTemplateDataStorage', JSON.stringify(model));
    this.router.navigate(['/import-export/edit']);
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
        // this.masterFileService.deleteLabGroup([{ LabGroupID: id }])
        //   .subscribe(res => {
        //     Swal.fire(
        //       'Deleted!',
        //       'Your file has been deleted.',
        //       'success'
        //     ).then(() => {
        //       this.loadLists();
        //     });
        //   }, (err) => {
        //     console.log('delete >> ', err);
        //     this.toastrNotiService.error(err.error.statusText);
        //   });
      }
    });
  }

  public onCreateNew = () => {
    sessionStorage.removeItem('ImportExportTemplateDataStorage');
    this.router.navigate(['/import-export/create']);
  }


}
