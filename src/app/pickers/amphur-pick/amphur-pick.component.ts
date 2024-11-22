import { Component, OnInit } from '@angular/core';
import { AmphurModel } from '@app/models/amphur.model';
import { RepositoryService } from '@app/shared/repository.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PickerBaseComponent } from '../picker-base/picker-base.component';
import { PickerService } from '../picker.service';

@Component({
  selector: 'app-amphur-pick',
  templateUrl: './amphur-pick.component.html',
  styleUrls: ['./amphur-pick.component.scss']
})
export class AmphurPickComponent extends PickerBaseComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    private pickerService: PickerService,
    private repoService: RepositoryService,
  ) {
    super(bsModalRef);
  }

  ngOnInit(): void {
    this.doLoadData();
  }

  async doLoadData() {
    try {
      this.spinner.show();
      console.log('xxx ');


      let query = `SELECT * FROM MSAddrAmphur LEFT OUTER JOIN MSAddrProvince On (MSAddrAmphur.ProvinceID = MSAddrProvince.ProvinceID) `;
      query += this.whereClause ? ` WHERE ${this.whereClause} ` : ``;

      const response = await this.repoService.queries({ queryString: query }).toPromise();
      const results = Object.assign([], response.data.results) as AmphurModel[];
      // this.resultDetails = results;
      this.pickItems = results;
      console.log('pickItems => ', this.pickItems);


      this.spinner.hide();

    } catch (err) {
      this.spinner.hide();
    }
  }

}
