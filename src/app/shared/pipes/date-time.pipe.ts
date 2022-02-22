import { Pipe, PipeTransform } from '@angular/core';
import { toReadableDate } from '@helpers/date.helper';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {

  transform(value: any): string {
    return toReadableDate(value);
  }

}
