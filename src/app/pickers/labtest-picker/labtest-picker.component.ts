import { Component, OnInit } from '@angular/core';
import { PickerBaseComponent } from '../picker-base/picker-base.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ResultsModel, RecalModal } from '../../models/results.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { PickerService } from '../picker.service';
import { SentSampleService } from '@app/screens/sent-sample/sent-sample.service';
import { RequestsDTO, RequestsModel } from '@app/models';
@Component({
  selector: 'app-labtest-picker',
  templateUrl: './labtest-picker.component.html',
  styleUrls: ['./labtest-picker.component.scss']
})
export class LabtestPickerComponent extends PickerBaseComponent implements OnInit {

  public ListNewFunction: Array<RecalModal>;
  constructor(
    public bsModalRef: BsModalRef,
    private spiner: NgxSpinnerService,
    private pickerService: PickerService,
    private sentSampleService: SentSampleService,
  ) {
    super(bsModalRef);
  }

  ngOnInit(): void {
    this.doLoadData();
  }

  doLoadData() {
    try {
      const storageData = sessionStorage.getItem('ReqResult');
      //console.log('storageData => ', storageData);
      const objData = JSON.parse(storageData) as RequestsModel;
      //console.log('objData.requestID => ', objData.requestID);

      if (storageData && storageData.trim() !== '') {
        const queryData = ` Select  *
                        From Recal_History
                        Where RequestsID = '${objData.requestID}'
                        order by round asc
                         `;
        const response = this.sentSampleService.query({ queryString: queryData });
        response.then(data => {
          //console.log('data => ', data);
          console.log('data.data.response => ', data.data.response);
          this.ListNewFunction = data.data.response;
         
        });
      }
     
    } catch (err) {
    }

  }

  pageChanged(event) {
    this.pageConfig.currentPage = event;
  }

}
