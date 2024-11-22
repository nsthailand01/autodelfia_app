import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PickerBaseComponent } from '../picker-base/picker-base.component';
import { PickerService } from '../picker.service';

@Component({
  selector: 'app-employee-picker',
  templateUrl: './employee-picker.component.html',
  styleUrls: ['./employee-picker.component.scss']
})
export class EmployeePickerComponent extends PickerBaseComponent implements OnInit {
  public textFilter: string = '';
  public filterExp: any;

  constructor(
    public bsModalRef: BsModalRef,
    private pickerService: PickerService
  ) {
    super(bsModalRef);

    this.filterExp = { $or: [{ EmployeeName: this.textFilter }, { FirstName: this.textFilter }, { LastName: this.textFilter }] };
  }

  ngOnInit(): void {
    this.doLoadData();
  }

  doLoadData() {
    try {
      this.spinner.show();

      const item = {
        sqlSelect: `it.*`,
        sqlFrom: ``,
        sqlWhere: this.whereClause
      };

      this.pickerService.getEmployees(item)
        // tslint:disable-next-line: deprecation
        .subscribe((response) => {
          this.pickItems = response.data.MSEmployees;
        }, (err) => {
          console.log('err >> ', err);
        });

      this.spinner.hide();

    } catch (err) {
      this.spinner.hide();
    }
  }

  pageChanged(event) {
    this.pageConfig.currentPage = event;
  }

}
