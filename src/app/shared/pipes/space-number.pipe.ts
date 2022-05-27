import { Pipe, PipeTransform } from '@angular/core';

// e.g. from 1234567.89 => 1 234 567.89
@Pipe({
  name: 'spaceNumber'
})
export class SpaceNumberPipe implements PipeTransform {

  transform(value: string | number, decimals?: number): string {
    // return value?.toString().replace(/(?!^)(?=(?:\d{3})+$)/g, ' ');
    const parts = (value ?? '').toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    parts[1] = parts[1]?.slice(0, decimals);
    return parts[1] ? parts.join('.') : parts[0];
  }

}
