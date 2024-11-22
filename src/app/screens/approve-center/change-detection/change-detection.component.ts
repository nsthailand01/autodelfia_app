import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-detection',
  templateUrl: './change-detection.component.html',
  styleUrls: ['./change-detection.component.scss']
})
export class ChangeDetectionComponent {

  testChangeDetectorRun() {
    console.log(
      `Change detection just ran!`
    );

    return '';
  }

}
