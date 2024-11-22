import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private renderer: Renderer2
  ) { }

  renderExternalScript(src: string): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(document.body, script);
    return script;
  }

  ngOnInit(): void {
    // this.renderExternalScript('../../../assets/js/register/jquery-3.3.1.min.js').onload = () => {
    //   console.log('load script main.js');
    //   // do something with this library
    // };
    // this.renderExternalScript('../../../assets/js/register/jquery.steps.js').onload = () => {
    //   console.log('load script');
    //   // do something with this library
    // };
    // this.renderExternalScript('../../../assets/js/register/main.js').onload = () => {
    //   console.log('load script main.js');
    //   // do something with this library
    // };
  }

}
