import { FormControl } from '@angular/forms';
import * as moment from 'moment-mini-ts';

export class TezedgeTimeValidator {

  static isTime(control: FormControl): { [key: string]: any } {
    if (!control.value ) {
      return null;
    }
    const pattern = /(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]?[0-9]?[0-9], |.[0-9]?[0-9]?[0-9],|, |,)([0-3]?[0-9])( ([A-Za-z]{1,3}) |(([./-])[0-1]?[0-9]([./-])))([0-9][0-9])( |)/g;
    const value = control.value.toString();
    if (value.match(pattern) === null || !moment(TezedgeTimeValidator.getDateFormat(value)).isValid()) {
      return { invalidTime: true };
    }

    return null;
  }

  // static isDate(control: FormControl): { [key: string]: any } {
  //   const pattern = /^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/;
  //
  //   if (!moment(control.value).format('MM/DD/YYYY').match(pattern)) {
  //     return { invalidDate: true };
  //   }
  //   return null;
  // }
  //
  // static isHour(control: FormControl): { [key: string]: any } {
  //   const pattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3])$/;
  //
  //   if (!control.value.toString().match(pattern)) {
  //     return { invalidHour: true };
  //   }
  //   return null;
  // }

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

  private static getValidDate(dateStr): string {
    return ['DD/MM/YY', 'DD-MM-YY', 'DD.MM.YY', 'DD MMM YY']
      .filter(format => moment(dateStr, format).toString() !== 'Invalid date')
      .map(foundFormat => moment(dateStr, foundFormat).toString())[0];
  }
}
