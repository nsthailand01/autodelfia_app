import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDatetimePipe'
})
export class LocalDatetimePipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // console.log('value format >> ', args);
    if (!value) {
      return null;
    }

    const options = {
      day: '2-digit', month: '2-digit', year: 'numeric'
    };

    const currentDate = new Date(value);
    return currentDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
