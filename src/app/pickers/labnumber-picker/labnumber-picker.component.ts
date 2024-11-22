import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '@app/shared/repository.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PickerBaseComponent } from '../picker-base/picker-base.component';
import { PickerService } from '../picker.service';

@Component({
  selector: 'app-labnumber-picker',
  templateUrl: './labnumber-picker.component.html',
  styleUrls: ['./labnumber-picker.component.scss']
})
export class LabnumberPickerComponent extends PickerBaseComponent implements OnInit {

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
    console.log('doloadsomething => ', this.whereClause);
    try {
      this.spinner.show();

      let query = `SELECT * FROM Requests`;
      query += this.whereClause ? ` WHERE ${this.whereClause} ` : ``;
      query += ` ORDER BY LabNumber desc `
      console.log('query => ', query);
      const response = await this.repoService.queries({ queryString: query }).toPromise();
      const results = Object.assign([], response.data.results) as any[];
      this.pickItems = results;

      this.spinner.hide();

    } catch (err) {
      this.spinner.hide();
    }
  }

}
