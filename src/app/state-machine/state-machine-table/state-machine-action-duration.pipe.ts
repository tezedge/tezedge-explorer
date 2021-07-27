import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

const MILLISECOND_FACTOR = 1000;
const MICROSECOND_FACTOR = 1000000;
const NANOSECOND_FACTOR = 1000000000;

@Pipe({
  name: 'actionDuration'
})
export class StateMachineActionDurationPipe implements PipeTransform {

  transform(value: number): string {
    if (value > 1000000000) {
      return '<span class="text-red">' + this.format(value / NANOSECOND_FACTOR) + ' s</span>';
    } else if (value > 500000000) {
      return '<span class="text-red">' + this.format(value / MICROSECOND_FACTOR) + ' ms</span>';
    } else if (value > 1000000) {
      return '<span class="text-yellow">' + this.format(value / MICROSECOND_FACTOR) + ' ms</span>';
    } else if (value > 1) {
      return this.format(value / MILLISECOND_FACTOR) + ' μs';
    } else if (value) {
      return value.toString();
    }
  }

  private format(value: number): string {
    return formatNumber(value, 'en-US', '1.0-2');
  }

}
