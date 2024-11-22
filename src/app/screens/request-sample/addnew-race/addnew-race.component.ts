import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RaceModel } from '@app/models/race.model';
import { RepositoryService } from '@app/shared/repository.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addnew-race',
  templateUrl: './addnew-race.component.html',
  styleUrls: ['./addnew-race.component.scss']
})
export class AddnewRaceComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();
  title: string = '';
  race: RaceModel;

  list: any[] = [];
  itemform;
  numberOfItems = 0;

  constructor(
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private repoService: RepositoryService,
    protected notiService: ToastrService
  ) {
    this.itemform = this.formBuilder.group(new RaceModel());
  }

  ngOnInit() {
    console.log('race model : ', this.race);
    if (this.race) {
      this.itemform = this.formBuilder.group(this.race);
    }
  }

  saveToList(form: any) {
    this.triggerEvent(form.value.raceName);
    this.bsModalRef.hide();
  }

  onSave(form) {
    if (form.value.raceName == '') {
      return this.notiService.success('กรุณากรอกข้อมูล');
    }

    const raceDto = {
      Races: new Array<RaceModel>()
    };
    raceDto.Races = [Object.assign({}, this.itemform.value)];

    this.repoService.create('api/Race/save', raceDto)
      // tslint:disable-next-line: deprecation
      .subscribe((res: any) => {
        console.log('save race : ', res);
        // this.triggerEvent(form.value.raceName);
        this.emitData(res.data.Races);
        this.notiService.success('Save success');
      }, (err) => {
        console.log('err >> ', err);
      });

    this.bsModalRef.hide();
  }

  triggerEvent(item: string) {
    this.event.emit({ data: { raceName: item }, res: 200 });
  }

  emitData(data: any) {
    this.event.emit({ data: { Races: data } });
  }
}
