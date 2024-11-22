import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
// import { SplitAreaDirective, SplitComponent } from 'ngx-split';
import { Observable } from 'rxjs';
import { ChangeDetectionComponent } from '../change-detection/change-detection.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-approve-list',
  templateUrl: './approve-list.component.html',
  styleUrls: ['./approve-list.component.scss']
})

export class ApproveListComponent implements AfterViewInit {
  // @HostBinding('split-example-page')
  // @ViewChild('split', { static: false }) split: SplitComponent;
  // @ViewChild('area1', { static: false }) area1: SplitAreaDirective;
  // @ViewChild('area2', { static: false }) area2: SplitAreaDirective;

  constructor() {

  }
  ngAfterViewInit(): void {
    this.onload();
  }

  onload = () => {
    const mySubDiv = document.getElementById('#splitter');
    const e = document.getElementById('seperator');
    console.log('e > ', e);
    this.dragElement(e, 'H', null);
  }

  // function is used for dragging and moving
  dragElement = (element, direction, handler) => {
    // Two variables for tracking positions of the cursor
    const drag = { x: 0, y: 0 };
    const delta = { x: 0, y: 0 };
    /* if present, the handler is where you move the DIV from
       otherwise, move the DIV from anywhere inside the DIV */
    handler ? (handler.onmousedown = dragMouseDown) : (element.onmousedown = dragMouseDown);

    // function that will be called whenever the down event of the mouse is raised
    function dragMouseDown(e) {
      drag.x = e.clientX;
      drag.y = e.clientY;
      document.onmousemove = onMouseMove;
      document.onmouseup = () => { document.onmousemove = document.onmouseup = null; };
    }

    // function that will be called whenever the up event of the mouse is raised
    function onMouseMove(e) {
      const currentX = e.clientX;
      const currentY = e.clientY;

      delta.x = currentX - drag.x;
      delta.y = currentY - drag.y;

      const offsetLeft = element.offsetLeft;
      const offsetTop = element.offsetTop;


      const first = document.getElementById('first');
      const second = document.getElementById('second');
      let firstWidth = first.offsetWidth;
      let secondWidth = second.offsetWidth;
      if (direction === 'H') // Horizontal
      {
        element.style.left = offsetLeft + delta.x + 'px';
        firstWidth += delta.x;
        secondWidth -= delta.x;
      }
      drag.x = currentX;
      drag.y = currentY;
      first.style.width = firstWidth + 'px';
      second.style.width = secondWidth + 'px';
    }
  }

}
