import { AfterContentChecked, Directive, ElementRef, NgModule, OnInit, Renderer2 } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[required]'
})
export class MarkAsteriskDirective implements OnInit, AfterContentChecked {

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngAfterContentChecked(): void {
    const parent = this.renderer.parentNode(this.el.nativeElement);

    console.log('parent >> ', parent);

    if (parent.getElementsByTagName('label').length && !parent.getElementsByClassName('required-asterisk').length) {
      parent.getElementsByTagName('label')[0].innerHTML += '<span class="required-asterisk">*</span>';
    }
    else {
      const parent2 = this.renderer.parentNode(parent);
      console.log('parent 2 >> ', parent2);

      if (parent2.getElementsByTagName('label').length && !parent2.getElementsByClassName('required-asterisk').length) {
        parent2.getElementsByTagName('label')[0].innerHTML += '<span class="required-asterisk">*</span>';
      }
    }
  }

  ngOnInit(): void {

  }

}

@NgModule({
  declarations: [MarkAsteriskDirective],
  exports: [MarkAsteriskDirective]
})

export class MarkAsteriskDirectiveModule { }
