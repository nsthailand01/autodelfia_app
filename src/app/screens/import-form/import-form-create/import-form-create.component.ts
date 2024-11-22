import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/app-core/components/base/base.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-import-form-create',
  templateUrl: './import-form-create.component.html',
  styleUrls: ['./import-form-create.component.scss']
})
export class ImportFormCreateComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(
    private location: Location,
    private router: Router
  ) {
    super();
  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  }

  canDeactivate(): Observable<boolean> | boolean {
    // if (!this.isUpdated && this.requestsForm.dirty) {
    //   return this.confirmDlgService.open();
    // }
    return of(true);
  }

  public onNewClick = () => {
    // if (!this.isUpdated && this.requestsForm.dirty) {
    //   this.confirmDlgService.open().subscribe(res => {
    //     if (res) {
    //       this.onCreateNew();
    //     }
    //   });
    // } else {
    //   this.onCreateNew();
    // }
  }

  onCreateNew() {
    sessionStorage.removeItem('RequestsSampleDataStorage');
    this.createInitialForm();
  }

  createInitialForm() {

  }

  public goBack = () => {
    sessionStorage.removeItem('RequestsSampleDataStorage');

    if (window.history.length > 1) {
      this.location.back();
      // this.router.navigate(['/request-sample/lists']);
    } else {
      this.router.navigate(['/']);
    }
  }

  doSave() {

  }

}
