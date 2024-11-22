import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const HH = Math.floor(value / 3600);
    const MM = Math.floor((value % 3600) / 60);
    const SS = Math.floor(value % 60);

    const minutes: number = Math.floor(value / 60);
    // return moment(value).format('HH:mm:ss');

    return (
      ('00' + HH).slice(-2) +
      ':' +
      ('00' + MM).slice(-2) +
      ':' +
      ('00' + SS).slice(-2)
      // ('00' + minutes).slice(-2) +
      // ':' +
      // ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }
}
