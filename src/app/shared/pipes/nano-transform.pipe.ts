import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

const MILLISECOND_FACTOR = 1000;
const MICROSECOND_FACTOR = 1000000;
const NANOSECOND_FACTOR = 1000000000;

@Pipe({
  name: 'nanoTransform'
})
export class NanoTransformPipe implements PipeTransform {

  transform(value: number, defaultTime: string = 's'): unknown {
    if (!value) {
      return '0.00' + defaultTime;
    }
    return NanoTransformPipe.getClosestMeasurementUnit(value,);
  }

  private static getClosestMeasurementUnit(value: number): string {
    if (value > NANOSECOND_FACTOR) {
      return this.format(value / NANOSECOND_FACTOR) + 's';
    } else if (value > MICROSECOND_FACTOR) {
      return this.format(value / MICROSECOND_FACTOR) + 'ms';
    } else if (value > MILLISECOND_FACTOR) {
      return this.format(value / MILLISECOND_FACTOR) + 'μs';
    } else {
      return this.format(value) + 'ns';
    }
  }

  private static format(value: number): string {
    return formatNumber(value, 'en-US', '1.2-2');
  }
}
