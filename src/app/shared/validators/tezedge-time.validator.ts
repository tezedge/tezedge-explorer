import { FormControl } from '@angular/forms';
import * as moment from 'moment-mini-ts';

export class TezedgeTimeValidator {

  static isTime(control: FormControl): { [key: string]: any } {
    if (!control.value) {
      return null;
    }
    const pattern = /(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]?[0-9]?[0-9], |.[0-9]?[0-9]?[0-9],|, |,)([0-3]?[0-9])( ([A-Za-z]{1,3}) |(([./-])[0-1]?[0-9]([./-])))([0-9][0-9])( |)/g;
    const value = control.value.toString();
    if (value.match(pattern) === null || !moment(TezedgeTimeValidator.getDateFormat(value)).isValid()) {
      return { invalidTime: true };
    }

    return null;
  }

  static getDateFormat(value: string): Date {
    const dateStr = value.slice(value.indexOf(',') + 1);
    const validDate = TezedgeTimeValidator.getValidDate(dateStr);
    const date = new Date(Date.parse(validDate));
    const hms = value.slice(0, value.indexOf(value.includes('.') ? '.' : ','));

    const hours = Number(hms.slice(0, hms.indexOf(':')));
    date.setHours(hours);
    date.setMinutes(Number(hms.slice(hms.indexOf(':') + 1, hms.indexOf(':', 3))));
    date.setSeconds(Number(hms.slice(hms.lastIndexOf(':') + 1)));
    if (value.includes('.')) {
      date.setMilliseconds(Number(value.slice(value.indexOf('.') + 1, value.indexOf(','))));
    }
    return date;
  }

  private static getValidDate(dateStr: string): string {
    return ['DD/MM/YY', 'DD-MM-YY', 'DD.MM.YY', 'DD MMM YY']
      .filter(format => moment(dateStr, format).toString() !== 'Invalid date')
      .map(foundFormat => moment(dateStr, foundFormat).toString())[0];
  }
}
