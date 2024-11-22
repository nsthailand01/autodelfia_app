import { Component, OnInit } from '@angular/core';
import { DistrictModel } from '@app/models';
import { RepositoryService } from '@app/shared/repository.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PickerBaseComponent } from '../picker-base/picker-base.component';
import { PickerService } from '../picker.service';

@Component({
  selector: 'app-district-pick',
  templateUrl: './district-pick.component.html',
  styleUrls: ['./district-pick.component.scss']
})
export class DistrictPickComponent extends PickerBaseComponent implements OnInit {

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

      let query = `SELECT * FROM MSAddrDistrict `;
      query += `LEFT OUTER JOIN MSAddrAmphur On (MSAddrDistrict.AmphurID = MSAddrAmphur.AmphurID)`;
      query += `LEFT OUTER JOIN MSAddrProvince On (MSAddrAmphur.ProvinceID = MSAddrProvince.ProvinceID) `

      query += this.whereClause ? ` WHERE ${this.whereClause} ` : ``;

      const response = await this.repoService.queries({ queryString: query }).toPromise();
      const results = Object.assign([], response.data.results) as DistrictModel[];
      // this.resultDetails = results;
      this.pickItems = results;
      console.log('pickItems => ', this.pickItems);


      this.spinner.hide();

    } catch (err) {
      this.spinner.hide();
    }
  }

}
