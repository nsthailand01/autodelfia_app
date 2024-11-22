import { Component, Input, OnInit } from '@angular/core';
import { PickerBaseComponent } from '../picker-base/picker-base.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RepositoryService } from '@app/shared/repository.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PickerService } from '../picker.service';

@Component({
  selector: 'app-sample-type-picker',
  templateUrl: './sample-type-picker.component.html',
  styleUrls: ['./sample-type-picker.component.scss']
})
export class SampleTypePickerComponent extends PickerBaseComponent implements OnInit {
  @Input() sqlWhere: string = '';

  constructor(
    public bsModalRef: BsModalRef,
    private repoService: RepositoryService,
    private spiner: NgxSpinnerService,
    private pickerService: PickerService
  ) {
    super(bsModalRef);
    console.log('contructor');
  }

  ngOnInit(): void {
    // console.log('sqlWhere Input :: ', this.sqlWhere);
    this.doLoadData();
  }

  doLoadData() {
    try {
      this.spiner.show();

      if (this.sqlWhere) {
        this.pickerService.loadSampleTypeCondition({ sqlWhere: this.sqlWhere })
          .subscribe((res) => {
            this.pickItems = res.data.MSLabSampleTypes;
          }, (error) => {
            console.log('picker error >> ', error);
          });
      } else {
        this.pickerService.loadSampleType(null)
          .subscribe((response) => {
            this.pickItems = response.data.MSLabSampleTypes;
          }, (err) => {
            console.log('err >> ', err);
          });
      }

      this.spiner.hide();
    } catch (err) {
      this.spiner.hide();
      // console.log('Load item-pick catch >> ', err);
    }

  }

  pageChanged(event) {
    this.pageConfig.currentPage = event;
  }

}
