import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generate-barcode-ex',
  templateUrl: './generate-barcode-ex.component.html',
  styleUrls: ['./generate-barcode-ex.component.scss']
})
export class GenerateBarcodeExComponent implements OnInit {
  elementType = 'svg';
  value = 'someValue12340987';
  format = 'CODE128';
  lineColor = '#000000';
  width = 2;
  height = 100;
  displayValue = true;
  fontOptions = '';
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 20;
  background = '#ffffff';
  margin = 10;
  marginTop = 10;
  marginBottom = 10;
  marginLeft = 10;
  marginRight = 10;

  codeList: string[] = [
    '', 'CODE128',
    'CODE128A', 'CODE128B', 'CODE128C',
    'UPC', 'EAN8', 'EAN5', 'EAN2',
    'CODE39',
    'ITF14',
    'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
    'pharmacode',
    'codabar'
  ];

  constructor() { }

  ngOnInit(): void {
  }

  get values(): string[] {
    return this.value.split('\n');
  }

}
