import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

const MILLISECOND_FACTOR = 1000;
const MICROSECOND_FACTOR = 1000000;
const NANOSECOND_FACTOR  = 1000000000;

@Pipe({
  name: 'timeTransform'
})
export class StorageBlockDetailsTimeTransformPipe implements PipeTransform {

  transform(value: number, redText: boolean = true): string {
    if (!value) {
      return '0ns';
    }
    const newValue = StorageBlockDetailsTimeTransformPipe.getClosestMeasurementUnit(value);

    if (value >= 0.1 && redText) {
      return `<span class="text-red">${newValue}</span>`;
    }

    return newValue;
  }

  private static getClosestMeasurementUnit(value: number): string {
    if (value > 1) {
      return this.format(value) + ' s';
    } else if (value > 0.001) {
      return this.format(value * MILLISECOND_FACTOR) + ' ms';
    } else if (value > 0.000001) {
      return this.format(value * MICROSECOND_FACTOR) + ' μs';
    } else {
      return this.format(value * NANOSECOND_FACTOR) + ' ns';
    }
  }

  private static format(value: number): string {
    return formatNumber(value, 'en-US', '1.0-2');
  }
}
