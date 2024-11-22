import { Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appInputClear]'
})
export class InputClearDirective implements OnInit, OnChanges {
  @Input() appInputClear: any;
  @Output() inputClearChange = new EventEmitter();

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnChanges(change) {
    console.log('val', this.appInputClear);
    if (this.appInputClear) {
      console.log('show');
      this.showElement();
    }
    if (!this.appInputClear) {
      this.hideElement();
      console.log('hide');
    }
  }

  ngOnInit(): void {
    const me = this.el.nativeElement as HTMLInputElement;
    if (me.nodeName.toUpperCase() !== 'INPUT') {
      throw new Error('Invalid input type for clearableInput:' + me);
    }
    const wrapper = document.createElement('span') as HTMLSpanElement;
    const searchIcon = document.createElement('i') as HTMLElement;
    searchIcon.id = 'searchIcon';

    // // calls the clearvalue function
    // searchIcon.addEventListener('click', this.clearValue);
    searchIcon.addEventListener('click', () => this.clearValue());

    //// clears the textbox but not the model
    // searchIcon.addEventListener('click', function () {
    //     console.log('clicked');
    //     let inp = this.parentElement.previousSibling as HTMLInputElement;
    //     if (inp && inp.value.length) {

    //         inp.value = '';
    //     }

    // });
    wrapper.setAttribute('style', 'margin-left: -37px;position: relative; margin-right:37px;');

    searchIcon.setAttribute('style', 'display:none');
    searchIcon.className = 'fa fa-times fa-1x';
    wrapper.appendChild(searchIcon);
    wrapper.id = 'searchSpan';

    me.insertAdjacentElement('afterend', wrapper);
  }

  showElement() {
    const searchIcon = document.getElementById('searchIcon');
    if (searchIcon) {
      searchIcon.removeAttribute('style');
    }
  }

  hideElement() {
    const searchIcon = document.getElementById('searchIcon');
    if (searchIcon) {
      searchIcon.setAttribute('style', 'display:none');
    }
  }

  clearValue() {
    console.log('clicked');
    this.appInputClear = '';
    this.inputClearChange.emit(this.appInputClear);
  }

}
