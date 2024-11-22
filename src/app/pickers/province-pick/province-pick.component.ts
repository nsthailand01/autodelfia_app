import { Component, OnInit } from '@angular/core';
import { ProvinceModel } from '@app/models';
import { RepositoryService } from '@app/shared/repository.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PickerBaseComponent } from '../picker-base/picker-base.component';
import { PickerService } from '../picker.service';

@Component({
  selector: 'app-province-pick',
  templateUrl: './province-pick.component.html',
  styleUrls: ['./province-pick.component.scss']
})
export class ProvincePickComponent extends PickerBaseComponent implements OnInit {

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


      let query = `SELECT * FROM MSAddrProvince `;

      const response = await this.repoService.queries({ queryString: query }).toPromise();
      const results = Object.assign([], response.data.results) as ProvinceModel[];
      // this.resultDetails = results;
      this.pickItems = results;
      console.log('pickItems => ', this.pickItems);


      this.spinner.hide();

    } catch (err) {
      this.spinner.hide();
    }
  }

  pageChanged(event) {
    this.pageConfig.currentPage = event;
  }

}
