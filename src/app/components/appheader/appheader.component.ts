import { Component, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.scss']
})
export class AppheaderComponent implements OnInit {


  constructor(
    private snotifyService: SnotifyService,
  ) {

  }

  ngOnInit(): void {
  }

}
