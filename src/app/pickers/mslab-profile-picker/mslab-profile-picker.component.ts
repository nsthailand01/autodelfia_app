import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { PickerBaseComponent } from '@app/pickers/picker-base/picker-base.component';
import { PickerService } from '@app/pickers/picker.service';

@Component({
  selector: 'app-mslab-profile-picker',
  templateUrl: './mslab-profile-picker.component.html',
  styleUrls: ['./mslab-profile-picker.component.scss']
})
export class MslabProfilePickerComponent extends PickerBaseComponent implements OnInit {

  constructor(
    public bsModalRef: BsModalRef,
    private spiner: NgxSpinnerService,
    private pickerService: PickerService
  ) {
    super(bsModalRef);
  }

  ngOnInit(): void {
    this.doLoadData();
    this.title = 'วัตถุประสงค์';
  }

  doLoadData() {
    try {
      this.spiner.show();

      this.pickerService.getMSLabProfile(null)
        .subscribe((response) => {
          this.pickItems = response.data.MSLabProfiles;
        }, (err) => {
          console.log('err >> ', err);
        });

      this.spiner.hide();

    } catch (err) {
      this.spiner.hide();
    }
  }

  pageChanged(event) {
    this.pageConfig.currentPage = event;
  }

}
