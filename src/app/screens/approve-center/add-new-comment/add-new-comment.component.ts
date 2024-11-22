import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RepositoryService } from '@app/shared/repository.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-new-comment',
  templateUrl: './add-new-comment.component.html',
  styleUrls: ['./add-new-comment.component.scss']
})
export class AddNewCommentComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();

  list: any[] = [];
  itemform: FormGroup;
  commentType: string;
  comment: string;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private repoService: RepositoryService,
    protected notiService: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('itemform >> ', this.itemform);
    console.log('comment type >> ', this.commentType);
  }

  onSave(form) {
    if (!form) {
      return this.notiService.success('กรุณากรอกข้อมูล');
    }
    // if (form.value?.labAppvComment == '') {
    //   return this.notiService.success('กรุณากรอกข้อมูล');
    // }

    // const raceDto = {
    //   Races: new Array<RaceModel>()
    // };
    // raceDto.Races = [Object.assign({}, this.itemform.value)];

    // this.repoService.create('api/Race/save', raceDto)
    //   .subscribe((res) => {
    //     this.triggerEvent(form.value.raceName);
    //     this.notiService.success('Save success');
    //   }, (err) => {
    //     console.log('err >> ', err);
    //   });

    this.triggerEvent(form);
    this.bsModalRef.hide();
  }

  onCancel = () => {
    this.bsModalRef.hide();
  }

  triggerEvent(item: string) {
    this.event.emit({ data: { comment: item }, res: 200 });
  }

}
