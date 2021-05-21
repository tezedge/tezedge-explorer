import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandTransform'
})
export class ThousandTransformPipe implements PipeTransform {

  transform(value: number): string | number {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(0) + 'm';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'k';
    }
    return value;
  }

}
