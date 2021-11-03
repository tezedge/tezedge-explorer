import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

const MILLISECOND_FACTOR = 1000;
const MICROSECOND_FACTOR = 1000000;
const NANOSECOND_FACTOR = 1000000000;

@Pipe({
  name: 'nanoTransform'
})
export class NanoTransformPipe implements PipeTransform {

  transform(value: number, redThreshold?: number, yellowThreshold?: number): string {
    if (isNaN(value)) {
      return '-';
    }
    const result = NanoTransformPipe.getClosestMeasurementUnit(value);

    if (redThreshold && value > redThreshold) {
      return `<span class="text-red">${result}</span>`;
    } else if (yellowThreshold && value > yellowThreshold) {
      return `<span class="text-yellow">${result}</span>`;
    }

    return result;
  }

  private static getClosestMeasurementUnit(value: number): string {
    const isNegative = value < 0 ? '-' : '';
    value = Math.abs(value);

    if (value > NANOSECOND_FACTOR) {
      return isNegative + this.format(value / NANOSECOND_FACTOR) + 's';
    } else if (value > MICROSECOND_FACTOR) {
      return isNegative + this.format(value / MICROSECOND_FACTOR) + 'ms';
    } else if (value > MILLISECOND_FACTOR) {
      return isNegative + this.format(value / MILLISECOND_FACTOR) + 'μs';
    } else {
      return isNegative + this.format(value) + 'ns';
    }
  }

  private static format(value: number): string {
    return formatNumber(value, 'en-US', '1.2-2');
  }
}
