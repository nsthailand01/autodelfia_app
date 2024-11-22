import { PickerService } from './../picker.service';
import { Component, OnInit } from '@angular/core';
import { PickerBaseComponent } from '@app/pickers/picker-base/picker-base.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-position-pick',
  templateUrl: './position-pick.component.html',
  styleUrls: ['./position-pick.component.scss']
})
export class PositionPickComponent extends PickerBaseComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    private pickerService: PickerService,
  ) {
    super(bsModalRef);
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

      this.pickerService.getPosition(item)
        // tslint:disable-next-line: deprecation
        .subscribe((response) => {
          this.pickItems = response.data.MSPositions;
        }, (err) => {
          console.log('err >> ', err);
        });

      this.spinner.hide();

    } catch (err) {
      this.spinner.hide();
    }
  }

}
