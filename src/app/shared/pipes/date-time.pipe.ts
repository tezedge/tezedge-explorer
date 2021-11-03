import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-mini-ts';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {

  transform(value: any): string {
    return moment(Math.ceil(value / 1000000)).format('HH:mm:ss.SSS, DD MMM YY');
  }

}
