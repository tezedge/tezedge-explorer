import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';
import { MICROSECOND_FACTOR, MILLISECOND_FACTOR, NANOSECOND_FACTOR } from '@shared/constants/unit-measurements';

@Pipe({
  name: 'nanoTransform'
})
export class NanoTransformPipe implements PipeTransform {

  transform(value: number, redThreshold?: number, yellowThreshold?: number, fractionalDigits: number = 2): string {
    if (isNaN(value)) {
      return '-';
    } else if (value === 0) {
      return '0';
    }
    const result = NanoTransformPipe.getClosestMeasurementUnit(value, fractionalDigits);

    if (redThreshold && value > redThreshold) {
      return `<span class="text-red">${result}</span>`;
    } else if (yellowThreshold && value > yellowThreshold) {
      return `<span class="text-yellow">${result}</span>`;
    }

    return result;
  }

  private static getClosestMeasurementUnit(value: number, fractionalDigits: number): string {
    const isNegative = value < 0 ? '-' : '';
    value = Math.abs(value);

    if (value >= NANOSECOND_FACTOR) {
      return isNegative + this.format(value / NANOSECOND_FACTOR, fractionalDigits) + 's';
    } else if (value >= MICROSECOND_FACTOR) {
      return isNegative + this.format(value / MICROSECOND_FACTOR, fractionalDigits) + 'ms';
    } else if (value >= MILLISECOND_FACTOR) {
      return isNegative + this.format(value / MILLISECOND_FACTOR, fractionalDigits) + 'μs';
    } else {
      return isNegative + this.format(value, fractionalDigits) + 'ns';
    }
  }

  private static format(value: number, fractionalDigits: number): string {
    return formatNumber(value, 'en-US', `1.${fractionalDigits}-2`);
  }
}
