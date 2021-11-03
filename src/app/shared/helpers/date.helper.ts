import * as moment from 'moment-mini-ts';

function convertToReadableDate(value: number): string {
  return moment(Math.ceil(value / 1000000)).format('HH:mm:ss.SSS, DD MMM YY');
}

export const toReadableDate = (value: number): string => convertToReadableDate(value);
