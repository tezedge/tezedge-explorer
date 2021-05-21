import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

const MILLISECOND_FACTOR = 1000;
const MICROSECOND_FACTOR = 1000000;
const NANOSECOND_FACTOR = 1000000000;

@Pipe({
  name: 'timeTransform'
})
export class TimeTransformPipe implements PipeTransform {

  transform(value: number, redText: boolean = true, onlyMs: boolean = false, skipSpace: boolean = false): string {
    if (!value) {
      return '0' + (skipSpace ? '' : ' ') + 'ms';
    }

    let newValue;
    if (onlyMs) {
      newValue = TimeTransformPipe.format(value * MILLISECOND_FACTOR) + (skipSpace ? '' : ' ') + 'ms';
    } else {
      newValue = TimeTransformPipe.getClosestMeasurementUnit(value, skipSpace);
    }

    if (value >= 0.001 && redText) {
      return `<span class="text-red">${ newValue }</span>`;
    }

    return newValue;
  }

  private static getClosestMeasurementUnit(value: number, skipSpace: boolean): string {
    if (value > 1) {
      return this.format(value) + (skipSpace ? '' : ' ') + 's';
    } else if (value > 0.001) {
      return this.format(value * MILLISECOND_FACTOR) + (skipSpace ? '' : ' ') + 'ms';
    } else if (value > 0.000001) {
      return this.format(value * MICROSECOND_FACTOR) + (skipSpace ? '' : ' ') + 'μs';
    } else {
      return this.format(value * NANOSECOND_FACTOR) + (skipSpace ? '' : ' ') + 'ns';
    }
  }

  private static format(value: number): string {
    return formatNumber(value, 'en-US', '1.0-2');
  }
}
